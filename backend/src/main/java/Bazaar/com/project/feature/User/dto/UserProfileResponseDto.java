package Bazaar.com.project.feature.User.dto;

import java.util.List;
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
        java.time.LocalDate dob,
        Bazaar.com.project.feature.User.constant.Gender gender,
        String address,
        List<String> roles, // Render as string for frontend
        String avatarUrl, // Transformed URL for display (may be null)
        String profilePhotoPublicId,
        UUID accountId) {
}
