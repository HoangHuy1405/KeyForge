package Bazaar.com.project.feature.Order.service;

import java.util.List;
import java.util.UUID;

import org.springframework.lang.NonNull;

import Bazaar.com.project.feature.Order.dto.OrderRequestDto;
import Bazaar.com.project.feature.Order.dto.OrderResponseDto;
import Bazaar.com.project.feature.Order.model.OrderStatus;

public interface OrderService {
    OrderResponseDto placeOrder(@NonNull OrderRequestDto dto);

    OrderResponseDto findOrderById(@NonNull UUID id);

    OrderResponseDto cancelOrder(@NonNull UUID orderId);

    OrderResponseDto updateOrderStatus(@NonNull UUID orderId, OrderStatus newStatus);

    OrderResponseDto payOrder(@NonNull UUID orderId);

    OrderResponseDto refundOrder(@NonNull UUID orderId);

    List<OrderResponseDto> getAllOrderFromUserId(@NonNull UUID userId);
}
