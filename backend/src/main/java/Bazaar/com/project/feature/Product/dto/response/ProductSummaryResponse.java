package Bazaar.com.project.feature.Product.dto.response;

import java.time.Instant;
import java.util.UUID;

import Bazaar.com.project.feature.Product.enums.ProductCategory;
import Bazaar.com.project.feature.Product.enums.ProductStatus;
import lombok.Builder;

@Builder
public record ProductSummaryResponse(
        UUID id,
        String name,
        String thumbnailUrl,
        ProductCategory category,
        ProductStatus status,
        DetailedResponse details,
        LogisticsResponse logistic,
        InventoryResponse inventory,
        Integer availableQuantity,
        Instant createdAt) {
}
