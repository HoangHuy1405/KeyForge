package Bazaar.com.project.feature.User._Auth.command;

public record LoginByUsernameOrEmailCommand(String identifier, String password) {
}
