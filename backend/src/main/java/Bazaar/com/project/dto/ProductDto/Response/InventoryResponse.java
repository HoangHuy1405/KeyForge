package Bazaar.com.project.dto.ProductDto.Response;

import java.math.BigDecimal;

public record InventoryResponse(
                BigDecimal price,
                Integer stockQuantity,
                Integer reservedQuantity,
                Integer availableQuantity,
                Integer minOrderQuantity,
                Integer maxOrderQuantity) {
}
