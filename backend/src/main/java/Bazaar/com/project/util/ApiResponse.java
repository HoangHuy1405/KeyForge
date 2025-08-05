package Bazaar.com.project.util;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonPropertyOrder({ "status", "errorCode", "timestamp", "message", "data" })
public class ApiResponse<T> {
	private String status;
	private Object message;
	private T data;
	private int statusCode;
	private LocalDateTime timestamp;

	public ApiResponse() {
		this.timestamp = LocalDateTime.now();
	}

	public ApiResponse(HttpStatus httpStatus, Object message, T data, int statusCode) {
		this.status = httpStatus.is2xxSuccessful() ? "success" : "error";
		this.message = message;
		this.data = data;
		this.statusCode = statusCode;
		this.timestamp = LocalDateTime.now();
	}

	public void setStatusCode(int statusCode) {
		this.status = statusCode >= 200 ? "success" : "error";
		this.statusCode = statusCode;
	}
}
