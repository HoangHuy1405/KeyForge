package Bazaar.com.project.util;

import java.util.NoSuchElementException;

import Bazaar.com.project.service.auth.exception.CannotLoginException;
import Bazaar.com.project.service.auth.exception.EmailAlreadyExistException;
import Bazaar.com.project.service.auth.exception.UsernameAlreadyExistException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ApiResponse<Void>> handle(NoSuchElementException ex) {
        logger.warn("Resource not found: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(CannotLoginException.class)
    public ResponseEntity<ApiResponse<Void>> handle(CannotLoginException ex) {
        logger.warn("Login failed: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler({ EmailAlreadyExistException.class, UsernameAlreadyExistException.class })
    public ResponseEntity<ApiResponse<Void>> handle(RuntimeException ex) {
        logger.warn("Register failed: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handle(Exception ex) {
        logger.error("Unexpected error occurred", ex);

        ApiResponse<Void> response = ApiResponse.error("Internal server error");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
