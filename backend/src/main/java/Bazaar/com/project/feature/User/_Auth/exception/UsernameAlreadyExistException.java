package Bazaar.com.project.feature.User._Auth.exception;

public class UsernameAlreadyExistException extends RuntimeException {
    private static final String DEFAULT_MESSAGE = "Username is already taken.";

    public UsernameAlreadyExistException() {
        super(DEFAULT_MESSAGE);
    }

    public UsernameAlreadyExistException(String message) {
        super(message);
    }
}
