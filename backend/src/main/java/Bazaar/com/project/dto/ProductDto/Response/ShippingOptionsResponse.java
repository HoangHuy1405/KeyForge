package Bazaar.com.project.dto.ProductDto.Response;

import lombok.Builder;

@Builder
public record ShippingOptionsResponse(
        Boolean fast,
        Boolean regular,
        Boolean economy) {
}
