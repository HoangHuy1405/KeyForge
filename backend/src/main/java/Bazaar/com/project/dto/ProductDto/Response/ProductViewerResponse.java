package Bazaar.com.project.dto.ProductDto.Response;

import java.util.List;
import java.util.UUID;

import Bazaar.com.project.dto.ProductDto.ProductImageDto;
import Bazaar.com.project.dto.UserDto.UserProfileResponseDto;
import Bazaar.com.project.model.Product.ProductEnum.ProductCategory;
import Bazaar.com.project.model.Product.ProductEnum.ProductStatus;
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
