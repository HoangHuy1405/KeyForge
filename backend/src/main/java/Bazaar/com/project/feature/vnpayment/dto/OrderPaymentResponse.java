package Bazaar.com.project.feature.vnpayment.dto;

import java.math.BigDecimal;
import java.util.UUID;

import Bazaar.com.project.feature.Order.model.PaymentStatus;

import lombok.Builder;

@Builder
public record OrderPaymentResponse(
        UUID orderId,
        BigDecimal amountUsd,
        BigDecimal amountVnd,
        PaymentStatus status,
        BigDecimal exchangeRate,
        String message) {
}
