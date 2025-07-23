package Bazaar.com.project.service.auth.command;

public record LoginByUsernameOrEmailCommand(String identifier, String password) {
}

