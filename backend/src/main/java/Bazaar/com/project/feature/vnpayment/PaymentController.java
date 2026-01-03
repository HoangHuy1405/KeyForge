package Bazaar.com.project.feature.vnpayment;

import java.io.UnsupportedEncodingException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Bazaar.com.project.feature.Order.dto.OrderRequestDto;
import Bazaar.com.project.feature._common.annotation.ApiMessage;
import Bazaar.com.project.feature.vnpayment.dto.OrderPaymentResponse;
import Bazaar.com.project.feature.vnpayment.dto.VnPayCheckoutResponse;
import Bazaar.com.project.feature.vnpayment.services.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.Collections;

@RestController
@RequestMapping("payments")
@RequiredArgsConstructor
public class PaymentController {

        private final PaymentService paymentService;

        /**
         * VNPay checkout: Creates order + payment in one step
         * User should be redirected to the returned paymentUrl
         */
        @PostMapping("/checkout/vnpay")
        @ApiMessage("VNPay checkout created")
        public ResponseEntity<VnPayCheckoutResponse> vnpayCheckout(
                        @Valid @RequestBody OrderRequestDto orderRequest,
                        HttpServletRequest request) throws UnsupportedEncodingException {

                VnPayCheckoutResponse response = paymentService.createVnPayCheckout(orderRequest, request);
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        /**
         * VNPay callback endpoint - called by VNPay after payment
         * VNPay uses GET method for return URL
         */
        @GetMapping("/vnpay-return")
        @ApiMessage("Payment processed")
        public ResponseEntity<OrderPaymentResponse> vnpayReturn(HttpServletRequest request) {
                OrderPaymentResponse response = paymentService.processPaymentCallback(request);
                return ResponseEntity.status(HttpStatus.OK).body(response);
        }

        /**
         * VNPay IPN (Instant Payment Notification) endpoint
         * VNPay calls this endpoint to notify payment result (server-to-server)
         */
        @GetMapping("/vnpay-ipn")
        public ResponseEntity<?> vnpayIpn(HttpServletRequest request) {
                try {
                        paymentService.processPaymentCallback(request);
                        return ResponseEntity.ok(Collections.singletonMap("RspCode", "00"));
                } catch (Exception e) {
                        return ResponseEntity.ok(Collections.singletonMap("RspCode", "99"));
                }
        }
}
