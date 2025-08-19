package Bazaar.com.project.dto.ProductDto;

import java.util.List;

public record ProductMediaResponse(
        String thumbnailUrl,
        String thumbnailPublicId,
        Long thumbnailVersion,
        List<ProductImageDto> images) {
}
