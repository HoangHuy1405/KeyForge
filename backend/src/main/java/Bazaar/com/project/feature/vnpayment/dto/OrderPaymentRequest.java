package Bazaar.com.project.feature.vnpayment.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderPaymentRequest {
    @NotNull(message = "Order ID is required")
    private UUID orderId;
}
