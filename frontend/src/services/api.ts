import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { refresh } from "./AuthService";

interface ApiResponse<T = any> {
  status: "success" | "error";
  data?: T;
  message?: any;
  statusCode?: string;
  timestamp?: string;
}

interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

// === Khởi tạo axios instance ===
const instance: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080/",
  withCredentials: true,
  // headers: { "Content-Type": "application/json" }, // Bỏ nếu upload file
});

// === Request Interceptor ===
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// === Avoid Race Condition ===
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((failedReq) => {
    if (error) {
      failedReq.reject(error);
    } else {
      failedReq.resolve(token);
    }
  });
  failedQueue = [];
};

// === Response Interceptor ===
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const apiResponse = response.data;

    if (apiResponse.status === "success") {
      return apiResponse.data;
    } else {
      return Promise.reject({
        message: apiResponse.message,
        errorCode: apiResponse.statusCode,
        timestamp: apiResponse.timestamp,
      });
    }
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config; // axios không expose type _retry nên dùng any

    // Nếu bị 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {


      // nếu có thằng khác đang gọi refresh => đưa vào queue
      // sau khi xong, gọi resolve(token)
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          // sau khi đã có token
          .then((token) => {
            if (token) {
              originalRequest.headers["Authorization"] = "Bearer " + token;
            }
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // thằng đầu gọi refresh và set isRefreshing = true
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const data = await refresh();
        const newToken = data.accessToken;

        // set access_token mới
        localStorage.setItem("access_token", newToken);
        instance.defaults.headers.common["Authorization"] =
          "Bearer " + newToken;

        processQueue(null, newToken);

        return instance(originalRequest);
        // xử lý refresh fail
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("access_token");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Network hoặc các lỗi khác
    if (error.response && error.response.data) {
      const data = error.response.data as ApiResponse;
      return Promise.reject({
        message: data.message || "Unknown server error",
        errorCode: data.statusCode || "UNKNOWN_ERROR",
        timestamp: data.timestamp,
      });
    }

    return Promise.reject({
      message: error.message || "Network error",
      errorCode: "NETWORK_ERROR",
    });
  }
);
type ApiInstance = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
};

const api = instance as ApiInstance;

export default api;
