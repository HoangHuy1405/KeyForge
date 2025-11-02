package Bazaar.com.project.feature.Product._ProductMedia.dto;

import java.util.List;

public record ProductMediaResponse(
        String thumbnailUrl,
        String thumbnailPublicId,
        Long thumbnailVersion,
        List<ProductImageDto> images) {
}
