package Bazaar.com.project.feature.Order.dto;

import Bazaar.com.project.feature.Order.model.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderStatusUpdateRequest {
    @NotNull(message = "Order status is required")
    private OrderStatus status;
}
