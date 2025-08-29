package Bazaar.com.project.dto.ProductDto.Response;

import java.time.Instant;
import java.util.UUID;

import Bazaar.com.project.model.Product.ProductEnum.ProductCategory;
import Bazaar.com.project.model.Product.ProductEnum.ProductStatus;
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
