package Bazaar.com.project.dto.ProductDto.Response;

import java.util.UUID;

import Bazaar.com.project.model.Product.ProductEnum.ProductCategory;
import Bazaar.com.project.model.Product.ProductEnum.ProductStatus;
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