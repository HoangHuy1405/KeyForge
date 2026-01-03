package Bazaar.com.project.feature.Order.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import Bazaar.com.project.feature.Order.model.OrderStatus;
import Bazaar.com.project.feature.Order.model.PaymentMethod;
import Bazaar.com.project.feature.Order.model.PaymentStatus;
import Bazaar.com.project.feature.Order.model.ShippingMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Detailed DTO for order detail view with all timeline timestamps
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetailResponseDto {
    private UUID orderId;
    private UUID buyerId;
    private String buyerName;

    // Shipping info
    private String shippingAddress;
    private String receiverName;
    private String receiverPhone;
    private ShippingMethod shippingMethod;

    // Order info
    private OrderStatus orderStatus;
    private BigDecimal totalAmount;
    private List<OrderItemDetailDto> items;

    // Payment info
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;

    // Timeline timestamps
    private Instant createdAt;
    private Instant processingAt;
    private Instant shippedAt;
    private Instant deliveredAt;
    private Instant completedAt;
    private Instant cancelledAt;

    /**
     * Detailed order item info
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemDetailDto {
        private UUID productId;
        private String productName;
        private String thumbnailUrl;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
    }
}
