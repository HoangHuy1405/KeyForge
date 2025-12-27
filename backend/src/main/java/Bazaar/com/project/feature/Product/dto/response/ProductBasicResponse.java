package Bazaar.com.project.feature.Product.dto.response;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

import Bazaar.com.project.feature.Product.enums.ProductCategory;
import Bazaar.com.project.feature.Product.enums.ProductStatus;
import Bazaar.com.project.feature.Product.enums.StockStatus;
import lombok.Builder;

/**
 * Basic response after product creation.
 */
@Builder
public record ProductBasicResponse(
        UUID id,
        String name,
        String description,
        ProductCategory category,
        StockStatus stockStatus,
        ProductStatus status,
        BigDecimal price,
        Integer stockQuantity,
        Map<String, Object> attributes) {
}
