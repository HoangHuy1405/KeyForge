package Bazaar.com.project.feature.Order.dto;

import java.util.List;
import java.util.UUID;

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
    private String paymentMethod;
}
