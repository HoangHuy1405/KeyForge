package Bazaar.com.project.dto;

import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
        @NotBlank String username,
        @NotBlank String password,
        @NotBlank String fullname,
        @NotBlank String email,
        @NotBlank String phoneNum) {
}
