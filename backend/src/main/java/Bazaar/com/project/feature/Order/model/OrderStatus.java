package Bazaar.com.project.feature.Order.model;

public enum OrderStatus {
    PENDING, // Awaiting payment (for VNPay orders)
    PROCESSING, // Payment confirmed, order being prepared
    SHIPPED,
    DELIVERED,
    COMPLETED,
    CANCELLED
}
