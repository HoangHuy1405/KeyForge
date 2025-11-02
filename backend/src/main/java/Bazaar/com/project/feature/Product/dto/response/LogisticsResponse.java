package Bazaar.com.project.feature.Product.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;

@JsonInclude(JsonInclude.Include.NON_NULL)
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
