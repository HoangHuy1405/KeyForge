package Bazaar.com.project.feature.Product.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * Request DTO for updating product inventory (Step 2).
 */
public record UpdateInventoryRequest(
        @NotNull @Positive BigDecimal price,
        @NotNull @PositiveOrZero Integer stockQuantity,
        Integer minOrderQuantity,
        Integer maxOrderQuantity) {
}
