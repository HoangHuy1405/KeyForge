package Bazaar.com.project.feature.Order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import Bazaar.com.project.feature.Order.model.OrderStatus;
import Bazaar.com.project.feature.Order.model.PaymentMethod;
import Bazaar.com.project.feature.Order.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponseDto {
    private UUID orderId;
    private UUID buyerId;
    private String buyerName; // Optional, if needed for display
    private String shippingAddress;
    private BigDecimal totalAmount;
    private OrderStatus orderStatus;
    private PaymentStatus paymentStatus;
    private PaymentMethod paymentMethod;
    private LocalDateTime createdAt;
    private List<OrderItemResponseDto> items;
}