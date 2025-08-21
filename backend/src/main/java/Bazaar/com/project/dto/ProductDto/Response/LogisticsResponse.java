package Bazaar.com.project.dto.ProductDto.Response;

import lombok.Builder;

@Builder
public record LogisticsResponse(
                Integer weightGrams,
                Integer lengthCm,
                Integer widthCm,
                Integer heightCm,
                String location,
                Boolean preOrder,
                Integer preOrderLeadTimeDays,
                ShippingOptionsResponse shipping) {
}
