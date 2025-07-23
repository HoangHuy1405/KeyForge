package Bazaar.com.project.util;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonPropertyOrder({ "status", "errorCode", "timestamp", "message", "data" })
public class ApiResponse<T> {
	private String status;
	private String message;
	private T data;
	private String errorCode;
	private LocalDateTime timestamp;

	public ApiResponse(HttpStatus httpStatus, String message, T data, String errorCode) {
		this.status = httpStatus.is2xxSuccessful() ? "success" : "error";
		this.message = message;
		this.data = data;
		this.errorCode = errorCode;
		this.timestamp = LocalDateTime.now();
	}
}
