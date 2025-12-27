package Bazaar.com.project.feature.Product.dto.request;

import java.math.BigDecimal;
import java.util.Map;

import Bazaar.com.project.feature.Product.enums.ProductCategory;
import Bazaar.com.project.feature.Product.enums.StockStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for updating an existing KeyForge product.
 */
public record UpdateProductRequest(
        // Basic Info
        @NotBlank @Size(max = 100) String name,
        @Size(max = 2000) String description,
        @NotNull ProductCategory category,
        @NotNull StockStatus stockStatus,

        // Pricing & Inventory
        @NotNull @Positive BigDecimal price,
        @NotNull @PositiveOrZero Integer stockQuantity,
        Integer minOrderQuantity,
        Integer maxOrderQuantity,

        // Category-specific attributes
        @NotNull Map<String, Object> attributes,

        // Logistics (optional)
        Integer weightGrams,
        Integer lengthCm,
        Integer widthCm,
        Integer heightCm,
        String location,
        Boolean supportFastShipping,
        Boolean supportRegularShipping,
        Boolean supportEconomyShipping) {
}
