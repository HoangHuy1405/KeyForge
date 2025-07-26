//package Bazaar.com.project.model.Order;
//
//import java.math.BigDecimal;
//import java.util.List;
//
//import Bazaar.com.project.model.BaseEntity;
//import Bazaar.com.project.model.User.User;
//import com.fasterxml.jackson.annotation.JsonManagedReference;
//import jakarta.persistence.*;
//import jakarta.validation.constraints.DecimalMin;
//import jakarta.validation.constraints.NotBlank;
//import jakarta.validation.constraints.NotEmpty;
//import jakarta.validation.constraints.NotNull;
//import jakarta.validation.constraints.Size;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.EqualsAndHashCode;
//import lombok.NoArgsConstructor;
//
//@Entity
//@Table(name = "orders")
//@Data
//@EqualsAndHashCode(callSuper = true)
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class Order extends BaseEntity {
//
//    @JoinColumn(name = "buyer_id", nullable = false)
//    @ManyToOne(fetch = FetchType.LAZY)
//    @NotNull(message = "Buyer is required")
//    private User buyer;
//
//    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
//    @NotEmpty(message = "Order must have at least one item")
//    @JsonManagedReference
//    private List<OrderItem> items;
//
//    @Column(name = "shipping_address", nullable = false, length = 255)
//    @NotBlank(message = "Shipping address is required")
//    @Size(max = 255, message = "Shipping address must be at most 255 characters")
//    private String shippingAddress;
//
//    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
//    @NotNull(message = "Total amount is required")
//    @DecimalMin(value = "0.0", inclusive = false, message = "Total amount must be greater than zero")
//    private BigDecimal totalAmount;
//
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false, length = 20)
//    @NotNull(message = "Order status is required")
//    private OrderStatus status;
//
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false, length = 20)
//    @NotNull(message = "Payment method is required")
//    private PaymentMethod paymentMethod;
//
//    public void changeStatus(OrderStatus newStatus) {
//        // Example rule: can't go back from DELIVERED to PROCESSING
//        if (this.status == OrderStatus.DELIVERED && newStatus != OrderStatus.CANCELLED) {
//            throw new IllegalStateException("Cannot change status from DELIVERED to " + newStatus);
//        }
//        this.status = newStatus;
//    }
//    public boolean isCompleted() {
//        return this.status == OrderStatus.DELIVERED;
//    }
//    public boolean isCancelled() {
//        return this.status == OrderStatus.CANCELLED;
//    }
//    public boolean isTotalAmountValid() {
//        BigDecimal calculated = items.stream()
//                .map(OrderItem::getSubtotal)
//                .reduce(BigDecimal.ZERO, BigDecimal::add);
//        return this.totalAmount.compareTo(calculated) == 0;
//    }
//}
