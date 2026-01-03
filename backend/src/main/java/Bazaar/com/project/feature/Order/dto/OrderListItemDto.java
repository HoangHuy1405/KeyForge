package Bazaar.com.project.feature.Order.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import Bazaar.com.project.feature.Order.model.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Lightweight DTO for order list view (my-orders)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderListItemDto {
    private UUID orderId;
    private OrderStatus orderStatus;
    private BigDecimal totalAmount;
    private Instant createdAt;
    private List<OrderItemSummaryDto> items;

    /**
     * Summary of order item for list view
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemSummaryDto {
        private String productName;
        private Integer quantity;
        private String thumbnailUrl;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
    }
}
