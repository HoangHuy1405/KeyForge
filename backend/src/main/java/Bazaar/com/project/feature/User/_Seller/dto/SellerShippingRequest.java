package Bazaar.com.project.feature.User._Seller.dto;

import lombok.Builder;

@Builder
public record SellerShippingRequest(
        Boolean express,
        Boolean standard,
        Boolean economy) {

}
