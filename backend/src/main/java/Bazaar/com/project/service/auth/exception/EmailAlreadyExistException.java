package Bazaar.com.project.service.auth.exception;

public class EmailAlreadyExistException extends RuntimeException{
    private static final String DEFAULT_MESSAGE = "Email is already in use.";
    public EmailAlreadyExistException(){
        super(DEFAULT_MESSAGE);
    }
    public EmailAlreadyExistException(String message){
        super(message);
    }
}
