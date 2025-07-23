package Bazaar.com.project.util;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import Bazaar.com.project.service.auth.exception.CannotLoginException;
import Bazaar.com.project.service.auth.exception.EmailAlreadyExistException;
import Bazaar.com.project.service.auth.exception.UsernameAlreadyExistException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ApiResponse<Void>> handle(NoSuchElementException ex) {
        logger.warn("Resource not found: {}", ex.getMessage());

        ApiResponse<Void> response = new ApiResponse<>(
            HttpStatus.NOT_FOUND,
            ex.getMessage(),
            null,
            String.valueOf(HttpStatus.NOT_FOUND.value())
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(CannotLoginException.class)
    public ResponseEntity<ApiResponse<Void>> handle(CannotLoginException ex) {
        logger.warn("Login failed: {}", ex.getMessage());

        ApiResponse<Void> response = new ApiResponse<>(
            HttpStatus.UNAUTHORIZED,
            ex.getMessage(),
            null,
            String.valueOf(HttpStatus.UNAUTHORIZED.value())
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler({ EmailAlreadyExistException.class, UsernameAlreadyExistException.class })
    public ResponseEntity<ApiResponse<Void>> handle(RuntimeException ex) {
        logger.warn("Register failed: {}", ex.getMessage());

        ApiResponse<Void> response = new ApiResponse<>(
            HttpStatus.CONFLICT,
            ex.getMessage(),
            null,
            String.valueOf(HttpStatus.CONFLICT.value())
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handle(Exception ex) {
        logger.error("Unexpected error occurred", ex);

        ApiResponse<Void> response = new ApiResponse<>(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Internal server error",
            null,
            String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value())
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class) 
    public ResponseEntity<ApiResponse<Object>> 
        handleValidationExceptions(MethodArgumentNotValidException ex) { 
        List<String> errorList = ex.getBindingResult().getFieldErrors().stream() 
            .map(error -> error.getField() + ": " + error.getDefaultMessage()) 
            .collect(Collectors.toList()); 

        String errors = String.join("; ", errorList); 
        ApiResponse<Object> response = new ApiResponse<>(
            HttpStatus.BAD_REQUEST, 
            errors, 
            null, 
            "VALIDATION_ERROR"); 
            
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST); 
    }
}
