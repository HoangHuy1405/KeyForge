package Bazaar.com.project.dto.ProductDto.Request;

import java.util.UUID;

import Bazaar.com.project.model.Product.ProductEnum.ProductCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateProductRequest(
                @NotBlank @Size(max = 100) String name,
                @Size(max = 500) String description,
                @NotNull ProductCategory category,
                @NotNull UUID sellerId) {
}
