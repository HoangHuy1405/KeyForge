package Bazaar.com.project.controller.errors;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import Bazaar.com.project.util.ApiResponse;


@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ApiResponse<?>> handleNotFound(NoSuchElementException ex) {
        ex.printStackTrace();
        var response = new ApiResponse<>(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                null,
                String.valueOf(HttpStatus.NOT_FOUND.value())
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    /*
     * Handle all generic exception (not defined yet)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneric(Exception ex) {
        ex.printStackTrace();

        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                ex.getMessage(),
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
