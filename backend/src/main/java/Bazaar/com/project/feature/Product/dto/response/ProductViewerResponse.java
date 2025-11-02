package Bazaar.com.project.feature.Product.dto.response;

import java.util.List;
import java.util.UUID;

import Bazaar.com.project.feature.Product._ProductMedia.dto.ProductImageDto;
import Bazaar.com.project.feature.Product.enums.ProductCategory;
import Bazaar.com.project.feature.Product.enums.ProductStatus;
import Bazaar.com.project.feature.User.dto.UserProfileResponseDto;
import lombok.Builder;

@Builder
public record ProductViewerResponse(UUID id,
        String name,
        String description,
        ProductCategory category,
        ProductStatus status,
        String thumbnailUrl,
        List<ProductImageDto> images,
        DetailedResponse details,
        InventoryResponse inventory,
        LogisticsResponse logistics,
        UserProfileResponseDto seller) {
}
