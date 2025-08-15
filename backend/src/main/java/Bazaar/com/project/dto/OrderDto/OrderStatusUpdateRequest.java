package Bazaar.com.project.dto.OrderDto;

import Bazaar.com.project.model.Order.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderStatusUpdateRequest {
    @NotNull(message = "Order status is required")
    private OrderStatus  status;
}
