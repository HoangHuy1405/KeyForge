package Bazaar.com.project.feature.vnpayment.dto;

import java.util.UUID;

import lombok.Builder;

@Builder
public record VnPayCheckoutResponse(
        UUID orderId,
        String paymentUrl,
        String vnpTxnRef) {
}
