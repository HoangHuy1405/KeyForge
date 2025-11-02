package Bazaar.com.project.feature.Product.dto.response;

import lombok.Builder;

@Builder
public record ShippingOptionsResponse(
                Boolean fast,
                Boolean regular,
                Boolean economy) {
}
