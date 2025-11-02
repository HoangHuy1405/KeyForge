package Bazaar.com.project.feature.Product.dto.response;

import java.util.UUID;

import Bazaar.com.project.feature.Product.enums.ProductCategory;
import Bazaar.com.project.feature.Product.enums.ProductStatus;
import lombok.Builder;

@Builder
public record ProductFullResponse(
        UUID id,
        String name,
        String description,
        ProductCategory category,
        ProductStatus status,
        DetailedResponse details,
        InventoryResponse inventory,
        LogisticsResponse logistics) {
}