package Bazaar.com.project.feature.Product.dto.request;

import java.util.Map;

import Bazaar.com.project.feature.Product.enums.ProductCategory;
import Bazaar.com.project.feature.Product.enums.ProductCondition;
import Bazaar.com.project.feature.Product.enums.StockStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for creating a new KeyForge product (DRAFT).
 * Step 1: Basic info + attributes + images.
 * Pricing/inventory added via separate update endpoint.
 * SellerId extracted from security context.
 */
public record CreateProductRequest(
        // Basic Info
        @NotBlank @Size(max = 100) String name,
        @Size(max = 2000) String description,
        @NotNull ProductCategory category,
        @NotNull ProductCondition productCondition,
        @NotNull StockStatus stockStatus,

        // Category-specific attributes (validated by service based on category)
        @NotNull Map<String, Object> attributes) {
}
