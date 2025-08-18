import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// === Request Interceptor ===
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// === Avoid Race Condition ===
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// === Response Interceptor ===
instance.interceptors.response.use(
  (response) => {
    const apiResponse = response.data;
    console.log(apiResponse);

    if (apiResponse.status === 'success') {
      return apiResponse.data;
    } else {
      return Promise.reject({
        message: apiResponse.message,
        errorCode: apiResponse.errorCode,
        timestamp: apiResponse.timestamp,
      });
    }
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu bị 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang trong quá trình refresh, đưa request vào hàng đợi
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          'http://localhost:8080/refresh-token',
          {},
          { withCredentials: true },
        );

        const newToken = res.data.token;
        localStorage.setItem('accessToken', newToken);
        instance.defaults.headers.common['Authorization'] =
          'Bearer ' + newToken;

        processQueue(null, newToken);

        return instance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('accessToken');
        // redirect hoặc xử lý logout ở đây nếu cần
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Network hoặc các lỗi khác
    if (error.response && error.response.data) {
      const { message, errorCode, timestamp } = error.response.data;
      return Promise.reject({
        message: message || 'Unknown server error',
        errorCode: errorCode || 'UNKNOWN_ERROR',
        timestamp,
      });
    }

    return Promise.reject({
      message: error.message || 'Network error',
      errorCode: 'NETWORK_ERROR',
    });
  },
);

export default instance;
