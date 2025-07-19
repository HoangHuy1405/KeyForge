package Bazaar.com.project.util;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// @Data
// @AllArgsConstructor
// @NoArgsConstructor
// @Builder
// public class ApiResponse<T> {
//     private String status;
//     private String message;
//     private T data;

//     public static <T> ApiResponse<T> success(T data) {
//         return ApiResponse.<T>builder()
//                 .status("success")
//                 .message("Request was successful")
//                 .data(data)
//                 .build();
//     }
//     public static <T> ApiResponse<T> success(T data, String message) {
//         return ApiResponse.<T>builder()
//                 .status("success")
//                 .message(message)
//                 .data(data)
//                 .build();
//     }
//     public static <T> ApiResponse<T> error(String message) {
//         return ApiResponse.<T>builder()
//                 .status("error")
//                 .message(message)
//                 .data(null)
//                 .build();
//     }
//     public static <T> ApiResponse<T> error(String message, T data) {
//         return ApiResponse.<T>builder()
//                 .status("error")
//                 .message(message)
//                 .data(data)
//                 .build();
//     }
// }

@JsonPropertyOrder({ "status", "errorCode", "timestamp", "message", "data" })
public class ApiResponse<T> {
	private String status;
	private String message;
	private T data;
	private String errorCode;
	private LocalDateTime timestamp = LocalDateTime.now();

	public ApiResponse(HttpStatus httpStatus, String message, T data, String errorCode) {
		this.status = httpStatus.is2xxSuccessful() ? "success" : "error";
		this.message = message;
		this.data = data;
		this.errorCode = errorCode;
		this.timestamp = LocalDateTime.now();
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}

	public String getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}

	public LocalDateTime getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}
}
