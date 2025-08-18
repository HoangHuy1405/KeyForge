package Bazaar.com.project.dto.UserDto;

import java.util.UUID;

// GET response DTO
public record UserProfileResponseDto(
        UUID id,
        String username,
        String fullname,
        String email,
        String phoneNum,
        String description,
        String role, // Render as string for frontend
        String avatarUrl, // Transformed URL for display (may be null)
        String profilePhotoPublicId,
        UUID accountId) {
}
