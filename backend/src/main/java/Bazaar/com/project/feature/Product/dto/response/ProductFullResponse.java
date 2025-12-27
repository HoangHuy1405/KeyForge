package Bazaar.com.project.feature.Product.dto.response;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

import Bazaar.com.project.feature.Product.enums.ProductCategory;
import Bazaar.com.project.feature.Product.enums.ProductStatus;
import Bazaar.com.project.feature.Product.enums.StockStatus;
import lombok.Builder;

/**
 * Full product response for seller's product management.
 * Includes all editable fields.
 */
@Builder
public record ProductFullResponse(
                UUID id,
                String name,
                String description,
                ProductCategory category,
                StockStatus stockStatus,
                ProductStatus status,
                String thumbnailUrl,
                Map<String, Object> attributes,
                InventoryResponse inventory,
                LogisticsResponse logistics,
                Instant createdAt,
                Instant updatedAt) {
}