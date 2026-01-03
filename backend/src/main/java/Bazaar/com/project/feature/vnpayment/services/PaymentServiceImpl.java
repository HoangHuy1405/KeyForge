package Bazaar.com.project.feature.vnpayment.services;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import Bazaar.com.project.config.VnPayConfig;
import Bazaar.com.project.exception.FuncErrorException;
import Bazaar.com.project.exception.PaymentException;
import Bazaar.com.project.exception.UserNotFoundException;
import Bazaar.com.project.util.CommonUtils;
import Bazaar.com.project.feature.Order.dto.OrderMapper;
import Bazaar.com.project.feature.Order.dto.OrderRequestDto;
import Bazaar.com.project.feature.Order.dto.OrderRequestDto.OrderItemRequestDto;
import Bazaar.com.project.feature.Order.model.Order;
import Bazaar.com.project.feature.Order.model.OrderItem;
import Bazaar.com.project.feature.Order.model.OrderStatus;
import Bazaar.com.project.feature.Order.model.PaymentStatus;
import Bazaar.com.project.feature.Order.repository.OrderRepository;
import Bazaar.com.project.feature.Product.model.Product;
import Bazaar.com.project.feature.Product.repository.ProductRepository;
import Bazaar.com.project.feature.User.model.User;
import Bazaar.com.project.feature.User.repository.UserRepository;
import Bazaar.com.project.feature.vnpayment.dto.OrderPaymentResponse;
import Bazaar.com.project.feature.vnpayment.dto.VnPayCheckoutResponse;
import Bazaar.com.project.feature.vnpayment.entity.PaymentTransaction;
import Bazaar.com.project.feature.vnpayment.repository.PaymentTransactionRepository;
import Bazaar.com.project.util.SecurityUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {
    private final PaymentTransactionRepository transactionRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    private final int EXPIRED_MINUTES = 15;

    @Override
    @Transactional
    public VnPayCheckoutResponse createVnPayCheckout(OrderRequestDto orderRequest, HttpServletRequest request)
            throws UnsupportedEncodingException {

        // 1. Get authenticated user
        UUID userId = SecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new UserNotFoundException("User not authenticated"));

        User buyer = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Buyer not found with the id: " + userId));

        // 2. Fetch products involved
        List<UUID> productIds = orderRequest.getItems().stream()
                .map(OrderItemRequestDto::getProductId)
                .toList();
        if (productIds == null || productIds.isEmpty()) {
            throw new FuncErrorException("No products in order");
        }
        List<Product> products = productRepository.findAllById(productIds);

        // 3. Map to OrderItems
        List<OrderItem> orderItems = OrderMapper.toOrderItems(orderRequest.getItems(), products);

        // 4. Create Order with PENDING status (not PROCESSING)
        Order order = Order.builder()
                .buyer(buyer)
                .receiverName(orderRequest.getReceiverName())
                .receiverPhone(orderRequest.getReceiverPhone())
                .shippingAddress(orderRequest.getShippingAddress())
                .orderStatus(OrderStatus.PENDING) // PENDING until payment success
                .paymentMethod(orderRequest.getPaymentMethod())
                .shippingMethod(orderRequest.getShippingMethod())
                .items(orderItems)
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        // Calculate total and set back-references
        order.updateTotalAmount();
        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }

        // 5. Save order
        Order savedOrder = orderRepository.save(order);

        // 6. Calculate total with fees
        BigDecimal subtotal = savedOrder.getTotalAmount(); // Items total
        BigDecimal shippingFee = orderRequest.getShippingMethod().getFee(); // $5, $10, or $20
        BigDecimal subtotalWithShipping = subtotal.add(shippingFee);

        // Platform fee: 0.1% of (subtotal + shipping)
        BigDecimal platformFeeRate = new BigDecimal("0.001"); // 0.1%
        BigDecimal platformFee = subtotalWithShipping.multiply(platformFeeRate);

        BigDecimal totalAmountUsd = subtotalWithShipping.add(platformFee);

        // 7. Create PaymentTransaction with real-time exchange rate
        BigDecimal exchangeRate = CommonUtils.fetchRealTimeExchangeRate();
        BigDecimal amountVnd = totalAmountUsd.multiply(exchangeRate);

        String vnpTxnRef = VnPayConfig.getRandomNumber(8);

        PaymentTransaction transaction = PaymentTransaction.builder()
                .user(buyer)
                .order(savedOrder)
                .vnpTxnRef(vnpTxnRef)
                .amountUsd(totalAmountUsd)
                .amountVnd(amountVnd)
                .exchangeRate(exchangeRate)
                .status(PaymentStatus.PENDING)
                .build();

        transactionRepository.save(transaction);

        // 8. Generate VNPay URL
        String paymentUrl = createVnPayPayment(amountVnd, vnpTxnRef, request);

        log.info(
                "Created VNPay checkout for order {}: subtotal={} USD, shipping={} USD, platformFee={} USD, total={} USD = {} VND (rate: {})",
                savedOrder.getId(), subtotal, shippingFee, platformFee, totalAmountUsd, amountVnd, exchangeRate);

        return VnPayCheckoutResponse.builder()
                .orderId(savedOrder.getId())
                .paymentUrl(paymentUrl)
                .vnpTxnRef(vnpTxnRef)
                .build();
    }

    @Override
    @Transactional
    public String createVnPayPayment(BigDecimal amountVnd, String vnpTxnRef, HttpServletRequest request)
            throws UnsupportedEncodingException {
        // VNPay rule: amount in VND x 100
        BigDecimal amount = amountVnd.multiply(BigDecimal.valueOf(100));

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", VnPayConfig.VNP_VERSION);
        vnp_Params.put("vnp_Command", VnPayConfig.VNP_COMMAND);
        vnp_Params.put("vnp_TmnCode", VnPayConfig.TMN_CODE);
        vnp_Params.put("vnp_Amount", String.valueOf(amount.longValue()));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnpTxnRef);
        vnp_Params.put("vnp_OrderInfo", "Order payment: " + vnpTxnRef);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", VnPayConfig.RETURN_URL);
        vnp_Params.put("vnp_IpAddr", VnPayConfig.getIpAddress(request));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        ZoneId zoneId = ZoneId.of("Asia/Ho_Chi_Minh");

        ZonedDateTime now = ZonedDateTime.now(zoneId);

        vnp_Params.put("vnp_CreateDate", now.format(formatter));
        vnp_Params.put("vnp_ExpireDate", now.plusMinutes(EXPIRED_MINUTES).format(formatter));

        // Build hash data with ENCODING
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VnPayConfig.hmacSHA512(VnPayConfig.HASH_SECRET, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VnPayConfig.PAY_URL + "?" + queryUrl;
        return paymentUrl;
    }

    @Override
    @Transactional
    public OrderPaymentResponse processPaymentCallback(HttpServletRequest request) {
        // 1. Verify Checksum first
        if (!verifyPayment(request)) {
            return null;
        }

        // 2. Get transaction details
        String vnpTxnRef = request.getParameter("vnp_TxnRef");
        String vnpResponseCode = request.getParameter("vnp_ResponseCode");
        String vnpTransactionStatus = request.getParameter("vnp_TransactionStatus");

        PaymentTransaction transaction = transactionRepository.findByVnpTxnRef(vnpTxnRef)
                .orElseThrow(() -> new PaymentException("Transaction not found: " + vnpTxnRef));

        // Idempotency check: if already paid, don't process again
        if (transaction.getStatus() == PaymentStatus.PAID) {
            log.info("Transaction {} already processed successfully.", vnpTxnRef);
            return transactionToResponse(transaction, "Payment already completed");
        }

        boolean isSuccessResponse = "00".equals(vnpResponseCode);
        boolean isSuccessStatus = "00".equals(vnpTransactionStatus);

        if (isSuccessResponse && isSuccessStatus) {
            return handleSuccessTransaction(transaction);
        } else {
            return handleFailedTransaction(transaction, vnpResponseCode);
        }
    }

    private boolean verifyPayment(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();

        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        if (fields.containsKey("vnp_SecureHashType"))
            fields.remove("vnp_SecureHashType");
        if (fields.containsKey("vnp_SecureHash"))
            fields.remove("vnp_SecureHash");

        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append("=");
                try {
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
            }
            if (itr.hasNext()) {
                hashData.append("&");
            }
        }

        String signValue = VnPayConfig.hmacSHA512(VnPayConfig.HASH_SECRET, hashData.toString());

        if (!signValue.equals(vnp_SecureHash)) {
            log.error("Checksum mismatch!");
            log.error("Received Hash: {}", vnp_SecureHash);
            log.error("Calculated Hash: {}", signValue);
            throw new PaymentException("Invalid Checksum - Possible data tampering");
        }
        return true;
    }

    private OrderPaymentResponse handleSuccessTransaction(PaymentTransaction transaction) {
        // Update transaction status
        transaction.setStatus(PaymentStatus.PAID);
        transactionRepository.save(transaction);

        // Update Order: payment status to PAID and order status to PROCESSING
        Order order = transaction.getOrder();
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setOrderStatus(OrderStatus.PROCESSING); // Now order is confirmed!
        order.setProcessingAt(Instant.now());

        orderRepository.save(order);

        log.info("Payment successful for order {}: {} VND. Order now PROCESSING.",
                order.getId(), transaction.getAmountVnd());

        return transactionToResponse(transaction, "Payment successful. Order confirmed.");
    }

    private OrderPaymentResponse handleFailedTransaction(PaymentTransaction transaction, String responseCode) {
        String errorMessage;
        switch (responseCode) {
            case "24":
                errorMessage = "Transaction was cancelled by user";
                break;
            case "11":
                errorMessage = "Transaction failed: Payment timeout";
                break;
            case "09":
                errorMessage = "Transaction failed: Card/Account not registered for Internet Banking";
                break;
            case "07":
                errorMessage = "Transaction failed: Deduction successful but suspected fraud";
                break;
            default:
                errorMessage = "Transaction failed with VNPay error code: " + responseCode;
                break;
        }

        log.warn("Payment failed for TxnRef: {}. Reason: {}", transaction.getVnpTxnRef(), errorMessage);
        throw new PaymentException(errorMessage);
    }

    private OrderPaymentResponse transactionToResponse(PaymentTransaction transaction, String message) {
        return OrderPaymentResponse.builder()
                .orderId(transaction.getOrder().getId())
                .amountUsd(transaction.getAmountUsd())
                .amountVnd(transaction.getAmountVnd())
                .status(transaction.getStatus())
                .exchangeRate(transaction.getExchangeRate())
                .message(message)
                .build();
    }
}