package Bazaar.com.project.dto.ProductDto.Response;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
public record InventoryResponse(
                BigDecimal price,
                Integer stockQuantity,
                Integer reservedQuantity,
                Integer availableQuantity,
                Integer minOrderQuantity,
                Integer maxOrderQuantity) {
}
