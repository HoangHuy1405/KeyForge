package Bazaar.com.project.dto.SellerDto;

import lombok.Builder;

@Builder
public record SellerShippingRequest(
        Boolean express,
        Boolean standard,
        Boolean economy) {

}
