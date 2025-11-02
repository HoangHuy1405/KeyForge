package Bazaar.com.project.feature.Product.dto.response;

import Bazaar.com.project.feature.Product.enums.ProductCondition;
import lombok.Builder;

@Builder
public record DetailedResponse(
        String brand,
        String model,
        String size,
        String material,
        String origin,
        ProductCondition condition) {
}
