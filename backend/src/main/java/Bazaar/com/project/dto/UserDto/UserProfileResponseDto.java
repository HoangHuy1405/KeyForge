package Bazaar.com.project.dto.UserDto;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;

// GET response DTO
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
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
