package Bazaar.com.project.feature.Product.dto.request;

import Bazaar.com.project.feature.Product.enums.ProductCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateBasicRequest(
        @NotBlank @Size(max = 100) String name,
        @Size(max = 500) String description,
        @NotNull ProductCategory category) {
}
