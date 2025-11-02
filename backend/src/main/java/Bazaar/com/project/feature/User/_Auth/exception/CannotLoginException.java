package Bazaar.com.project.feature.User._Auth.exception;

public class CannotLoginException extends RuntimeException {
    private static final String DEFAULT_MESSAGE = "Incorrect username or password.";

    public CannotLoginException() {
        super(DEFAULT_MESSAGE);
    }

    public CannotLoginException(String message) {
        super(message);
    }
}
