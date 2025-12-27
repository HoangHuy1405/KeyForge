package Bazaar.com.project.feature.Product.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

import Bazaar.com.project.feature.Product.enums.ProductCategory;
import Bazaar.com.project.feature.Product.enums.ProductStatus;
import Bazaar.com.project.feature.Product.enums.StockStatus;
import lombok.Builder;

/**
 * Summary response for product listing pages (grid view).
 * Compact with essential info for browsing.
 */
@Builder
public record ProductSummaryResponse(
                UUID id,
                String name,
                String thumbnailUrl,
                ProductCategory category,
                StockStatus stockStatus,
                ProductStatus status,
                BigDecimal price,
                Integer availableQuantity,
                String location,
                Map<String, Object> attributes,
                Instant createdAt) {
}
