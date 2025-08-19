package Bazaar.com.project.dto.ProductDto;

import java.util.UUID;

public record ProductImageDto(
        UUID id,
        String url,
        String publicId,
        Long version,
        Integer sortOrder) {
}
