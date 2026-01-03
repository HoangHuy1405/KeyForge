package Bazaar.com.project.feature.Order.dto;

import java.util.List;
import java.util.UUID;

import Bazaar.com.project.feature.Order.model.PaymentMethod;
import Bazaar.com.project.feature.Order.model.ShippingMethod;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequestDto {
    @NotNull(message = "Buyer ID is required")
    private UUID buyerId;
    @NotEmpty(message = "Order items are required")
    private List<OrderItemRequestDto> items;
    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;
    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
    @NotNull(message = "Shipping method is required")
    private ShippingMethod shippingMethod;
    @NotNull(message = "Receiver name is required")
    private String receiverName;
    @NotNull(message = "Receiver phone is required")
    private String receiverPhone;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemRequestDto {
        @NotNull(message = "Product ID is required")
        private UUID productId;
        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;
    }
}
