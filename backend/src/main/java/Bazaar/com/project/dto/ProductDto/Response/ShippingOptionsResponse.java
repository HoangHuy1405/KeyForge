package Bazaar.com.project.dto.ProductDto.Response;

public record ShippingOptionsResponse(
        Boolean fast,
        Boolean regular,
        Boolean economy) {
}
