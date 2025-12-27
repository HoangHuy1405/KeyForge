package Bazaar.com.project.feature.Product.dto.response;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import Bazaar.com.project.feature.Product._ProductMedia.dto.ProductImageDto;
import Bazaar.com.project.feature.Product.enums.ProductCategory;
import Bazaar.com.project.feature.Product.enums.ProductStatus;
import Bazaar.com.project.feature.Product.enums.StockStatus;
import Bazaar.com.project.feature.User.dto.UserProfileResponseDto;
import lombok.Builder;

/**
 * Full product detail for product viewer page (customer-facing).
 * Includes all public info, images, seller info.
 */
@Builder
public record ProductViewerResponse(
                UUID id,
                String name,
                String description,
                ProductCategory category,
                StockStatus stockStatus,
                ProductStatus status,
                String thumbnailUrl,
                List<ProductImageDto> images,
                Map<String, Object> attributes,
                InventoryResponse inventory,
                LogisticsResponse logistics,
                UserProfileResponseDto seller) {
}
