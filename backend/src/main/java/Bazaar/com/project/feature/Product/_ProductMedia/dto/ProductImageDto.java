package Bazaar.com.project.feature.Product._ProductMedia.dto;

import java.util.UUID;

public record ProductImageDto(
        UUID id,
        String url,
        String publicId,
        Long version,
        Integer sortOrder) {
}
