package Bazaar.com.project.feature.vnpayment.entity;

import java.math.BigDecimal;

import Bazaar.com.project.feature._common.model.BaseEntity;
import Bazaar.com.project.feature.Order.model.Order;
import Bazaar.com.project.feature.Order.model.PaymentStatus;
import Bazaar.com.project.feature.User.model.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "payment_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentTransaction extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "vnp_txn_ref", unique = true, nullable = false)
    private String vnpTxnRef;

    @Column(name = "amount_vnd", nullable = false)
    private BigDecimal amountVnd; // Amount in VND

    @Column(name = "amount_usd", precision = 19, scale = 2)
    private BigDecimal amountUsd; // Original amount in USD from Order

    @Column(name = "exchange_rate", precision = 19, scale = 2)
    private BigDecimal exchangeRate; // Stored rate at the time of transaction

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;
}
