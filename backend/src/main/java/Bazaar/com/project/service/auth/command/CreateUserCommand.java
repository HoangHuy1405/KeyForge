package Bazaar.com.project.service.auth.command;

public record CreateUserCommand(String username,
                                String password,
                                String fullname,
                                String email,
                                String phoneNum) {
}
