package Bazaar.com.project.dto.ProductDto.Request;

import Bazaar.com.project.model.Product.ProductEnum.ProductCondition;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateDetailsRequest(
        @Size(max = 100) String brand,
        @Size(max = 100) String model,
        @Size(max = 50) String size,
        @Size(max = 100) String material,
        @Size(max = 100) String origin,
        @NotNull ProductCondition condition) {
}
