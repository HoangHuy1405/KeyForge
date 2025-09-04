package Bazaar.com.project.model.Order;

import java.math.BigDecimal;
import java.util.List;

import Bazaar.com.project.model.BaseEntity;
import Bazaar.com.project.model.User.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "orders")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "buyer_id", nullable = false)
    @NotNull(message = "Buyer is required")
    private User buyer;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @NotEmpty(message = "Order must have at least one item")
    private List<OrderItem> items;

    @Column(name = "shipping_address", nullable = false, length = 255)
    @NotBlank(message = "Shipping address is required")
    @Size(max = 255, message = "Shipping address must be at most 255 characters")
    private String shippingAddress;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Total amount must be greater than zero")
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @NotNull(message = "Order status is required")
    private OrderStatus orderStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @NotNull(message = "Payment status is required")
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    // Handle create, set back-reference and calculate totalAmount
    public static Order Create(User buyer, String shippingAddress, PaymentMethod paymentMethod, List<OrderItem> orderItems){
        Order order = new Order();
        order.setBuyer(buyer);
        order.setShippingAddress(shippingAddress);
        order.setOrderStatus(OrderStatus.PROCESSING);
        order.setPaymentMethod(paymentMethod);
        order.setItems(orderItems);
        order.setPaymentStatus(PaymentStatus.PENDING);

        order.updateTotalAmount();

        // Set back-reference from each OrderItem
        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }

        return order;
    }

    public void changeOrderStatus(OrderStatus orderStatus) {
        // Example rule: can't go back from DELIVERED to PROCESSING
        if (orderStatus == this.orderStatus) {
            throw new IllegalStateException("The status is already set to " + orderStatus);
        }
        this.orderStatus = orderStatus;
    }

    public boolean isCompleted() {
        return this.orderStatus == OrderStatus.DELIVERED;
    }

    public boolean isCancelled() {
        return this.orderStatus == OrderStatus.CANCELLED;
    }

    public boolean isTotalAmountValid() {
        BigDecimal calculated = items.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return this.totalAmount.compareTo(calculated) == 0;
    }

    public void updateTotalAmount(){
        this.totalAmount =  items.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public void changePaymentStatus(PaymentStatus paymentStatus) {
        // Example rule: can't go back from DELIVERED to PROCESSING
        if (paymentStatus == this.paymentStatus) {
            throw new IllegalStateException("The status is already set to " + paymentStatus);
        }
        this.paymentStatus = paymentStatus;
    }

    public void pay(){
        changePaymentStatus(PaymentStatus.PAID);
    }

    public void refund() {
        changePaymentStatus(PaymentStatus.REFUNDED);
    }
}
