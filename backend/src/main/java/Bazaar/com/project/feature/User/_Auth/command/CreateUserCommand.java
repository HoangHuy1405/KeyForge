package Bazaar.com.project.feature.User._Auth.command;

public record CreateUserCommand(String username,
        String password,
        String fullname,
        String email,
        String phoneNum) {
}
