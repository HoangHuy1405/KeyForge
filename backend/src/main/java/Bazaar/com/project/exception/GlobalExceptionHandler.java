package Bazaar.com.project.exception;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import Bazaar.com.project.feature.User._Auth.exception.CannotLoginException;
import Bazaar.com.project.feature.User._Auth.exception.EmailAlreadyExistException;
import Bazaar.com.project.feature.User._Auth.exception.UsernameAlreadyExistException;
import Bazaar.com.project.feature._common.response.ApiResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import org.springframework.security.authorization.AuthorizationDeniedException;

@ControllerAdvice
public class GlobalExceptionHandler {
        private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

        @ExceptionHandler(value = {
                        NoResourceFoundException.class,
                        NoSuchElementException.class,
                        UserNotFoundException.class
        })
        public ResponseEntity<ApiResponse<Object>> handleNotFoundException(Exception ex) {
                logger.warn("Resource not found: {}", ex.getMessage());

                ApiResponse<Object> response = new ApiResponse<Object>(
                                HttpStatus.NOT_FOUND,
                                ex.getMessage(),
                                null,
                                HttpStatus.NOT_FOUND.value());

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        @ExceptionHandler(CannotLoginException.class)
        public ResponseEntity<ApiResponse<Void>> handle(CannotLoginException ex) {
                logger.warn("Login failed: {}", ex.getMessage());

                ApiResponse<Void> response = new ApiResponse<>(
                                HttpStatus.UNAUTHORIZED,
                                ex.getMessage(),
                                null,
                                HttpStatus.UNAUTHORIZED.value());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        @ExceptionHandler({ EmailAlreadyExistException.class, UsernameAlreadyExistException.class })
        public ResponseEntity<ApiResponse<Void>> handle(RuntimeException ex) {
                logger.warn("Register failed: {}", ex.getMessage());

                ApiResponse<Void> response = new ApiResponse<>(
                                HttpStatus.CONFLICT,
                                ex.getMessage(),
                                null,
                                HttpStatus.CONFLICT.value());
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        @ExceptionHandler({ MethodArgumentNotValidException.class, IdInvalidException.class })
        public ResponseEntity<ApiResponse<Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
                List<String> errorList = ex.getBindingResult().getFieldErrors().stream()
                                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                                // .map(error -> error.getDefaultMessage())
                                .collect(Collectors.toList());

                String errors = String.join("; ", errorList);
                logger.warn("Validation failed: {}", errors);

                ApiResponse<Object> response = new ApiResponse<>(
                                HttpStatus.BAD_REQUEST,
                                errors,
                                null,
                                HttpStatus.BAD_REQUEST.value());
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(AuthorizationDeniedException.class)
        public ResponseEntity<ApiResponse<Void>> handleAuthorizationDenied(AuthorizationDeniedException ex) {
                logger.warn("Access denied: {}", ex.getMessage());

                ApiResponse<Void> response = new ApiResponse<>(
                                HttpStatus.FORBIDDEN,
                                "Access denied: You don't have permission to access this resource",
                                null,
                                HttpStatus.FORBIDDEN.value());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        @ExceptionHandler(InvalidFilterValueException.class)
        public ResponseEntity<ApiResponse<Void>> handleInvalidFilterValue(InvalidFilterValueException ex) {
                logger.warn("Invalid filter value: {}", ex.getMessage());

                ApiResponse<Void> response = new ApiResponse<>(
                                HttpStatus.BAD_REQUEST,
                                ex.getMessage(), // "Invalid filter value provided"
                                null,
                                HttpStatus.BAD_REQUEST.value());
                return ResponseEntity.badRequest().body(response);
        }

        @ExceptionHandler(InvalidDataAccessApiUsageException.class)
        public ResponseEntity<?> handleInvalidDataAccess(InvalidDataAccessApiUsageException ex) {
                logger.warn("Invalid data access: {}", ex.getMessage());

                ApiResponse<Void> response = new ApiResponse<>(
                                HttpStatus.BAD_REQUEST,
                                "Invalid data access request. Please check your input.",
                                null,
                                HttpStatus.BAD_REQUEST.value());

                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(response);
        }

        @ExceptionHandler(InvalidArgumentException.class)
        public ResponseEntity<ApiResponse<Void>> handleInvalidArgument(InvalidArgumentException ex) {
                logger.warn("Invalid argument: {}", ex.getMessage());

                ApiResponse<Void> response = new ApiResponse<>(
                                HttpStatus.BAD_REQUEST,
                                ex.getMessage(),
                                null,
                                HttpStatus.BAD_REQUEST.value());
                return ResponseEntity.badRequest().body(response);
        }

        @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
        public ResponseEntity<ApiResponse<Void>> handleBadCredentials(
                        org.springframework.security.authentication.BadCredentialsException ex) {
                logger.warn("Authentication failed: {}", ex.getMessage());

                ApiResponse<Void> response = new ApiResponse<>(
                                HttpStatus.UNAUTHORIZED,
                                "Invalid username or password",
                                null,
                                HttpStatus.UNAUTHORIZED.value());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        @ExceptionHandler(DataIntegrityViolationException.class)
        public ResponseEntity<ApiResponse<Void>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
                logger.error("Data integrity violation: {}", ex.getMessage());

                String userMessage = "Data validation failed. Please check your input and ensure all required fields are provided.";

                ApiResponse<Void> response = new ApiResponse<>(
                                HttpStatus.BAD_REQUEST,
                                userMessage,
                                null,
                                HttpStatus.BAD_REQUEST.value());
                return ResponseEntity.badRequest().body(response);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ApiResponse<Void>> handle(Exception ex) {
                logger.error("Unexpected error occurred", ex);

                ApiResponse<Void> response = new ApiResponse<>(
                                HttpStatus.INTERNAL_SERVER_ERROR,
                                "An unexpected error occurred. Please try again later.",
                                null,
                                HttpStatus.INTERNAL_SERVER_ERROR.value());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
}
