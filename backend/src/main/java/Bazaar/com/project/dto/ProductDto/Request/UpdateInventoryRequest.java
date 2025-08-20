package Bazaar.com.project.dto.ProductDto.Request;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdateInventoryRequest(
                @NotNull @Min(0) BigDecimal price,
                @NotNull @Min(0) Integer stockQuantity,
                @NotNull @Min(0) Integer reservedQuantity,
                @Min(1) Integer minOrderQuantity,
                @Min(1) Integer maxOrderQuantity // null = unlimited
) {
}
