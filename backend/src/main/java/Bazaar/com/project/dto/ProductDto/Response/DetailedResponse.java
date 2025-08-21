package Bazaar.com.project.dto.ProductDto.Response;

import Bazaar.com.project.model.Product.ProductEnum.ProductCondition;
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
