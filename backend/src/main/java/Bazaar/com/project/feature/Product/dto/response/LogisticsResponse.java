package Bazaar.com.project.feature.Product.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;

/**
 * Logistics response for shipping info.
 * Note: Pre-order status is now in StockStatus, not here.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
public record LogisticsResponse(
        Integer weightGrams,
        Integer lengthCm,
        Integer widthCm,
        Integer heightCm,
        String location,
        ShippingOptionsResponse shipping) {
}
