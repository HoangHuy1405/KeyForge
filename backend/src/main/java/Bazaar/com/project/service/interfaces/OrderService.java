package Bazaar.com.project.service.interfaces;

import java.util.List;
import java.util.UUID;

import Bazaar.com.project.dto.OrderDto.OrderRequestDto;
import Bazaar.com.project.dto.OrderDto.OrderResponseDto;
import Bazaar.com.project.model.Order.OrderStatus;

public interface OrderService {
    OrderResponseDto placeOrder(OrderRequestDto dto);
    OrderResponseDto findOrderById(UUID id);
    OrderResponseDto cancelOrder(UUID orderId);
    OrderResponseDto changeStatus(UUID orderId, OrderStatus newStatus);
    List<OrderResponseDto> getAllOrderFromUserId(UUID userId);
} 
