package Bazaar.com.project.feature.vnpayment.services;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;

import Bazaar.com.project.feature.Order.dto.OrderRequestDto;
import Bazaar.com.project.feature.vnpayment.dto.OrderPaymentResponse;
import Bazaar.com.project.feature.vnpayment.dto.VnPayCheckoutResponse;

import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {
    /**
     * Creates order with PENDING status and VNPay payment URL in one step
     * 
     * @param orderRequest order details (items, address, etc)
     * @param request      HTTP request for IP address
     * @return VnPayCheckoutResponse with orderId and paymentUrl
     */
    VnPayCheckoutResponse createVnPayCheckout(OrderRequestDto orderRequest, HttpServletRequest request)
            throws UnsupportedEncodingException;

    /**
     * Creates the VNPay payment URL
     * 
     * @param amountVnd amount in VND
     * @param vnpTxnRef transaction reference
     * @param request   HTTP request for IP address
     * @return VNPay payment URL
     */
    String createVnPayPayment(BigDecimal amountVnd, String vnpTxnRef, HttpServletRequest request)
            throws UnsupportedEncodingException;

    /**
     * Processes VNPay callback and updates Order payment status
     * 
     * @param request HTTP request with VNPay parameters
     * @return OrderPaymentResponse with result
     */
    OrderPaymentResponse processPaymentCallback(HttpServletRequest request);
}
