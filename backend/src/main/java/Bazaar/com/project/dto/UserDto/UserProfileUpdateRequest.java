package Bazaar.com.project.dto.UserDto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserProfileUpdateRequest(
                @NotBlank @Size(max = 255) String fullname,
                @NotBlank @Size(max = 255) String username,
                @Email(message = "Email is not valid", regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$") String email,
                @Size(max = 32) @NotBlank(message = "Phone number is required") @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Phone number must be valid and contain 10–15 digits") String phoneNum,
                @Size(max = 2000) String description) {
}
