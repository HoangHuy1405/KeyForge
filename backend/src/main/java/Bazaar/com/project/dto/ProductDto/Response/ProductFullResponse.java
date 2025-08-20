package Bazaar.com.project.dto.ProductDto.Response;

import java.util.UUID;

import Bazaar.com.project.model.Product.ProductEnum.ProductCategory;
import Bazaar.com.project.model.Product.ProductEnum.ProductStatus;

public record ProductFullResponse(
                UUID id,
                String name,
                String description,
                ProductCategory category,
                ProductStatus status,
                DetailedResponse detailed,
                InventoryResponse inventory,
                LogisticsResponse logistics) {
}