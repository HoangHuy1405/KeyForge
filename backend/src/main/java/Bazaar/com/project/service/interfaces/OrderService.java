package Bazaar.com.project.service.interfaces;

import java.util.List;
import java.util.UUID;

import Bazaar.com.project.dto.OrderRequestDto;
import Bazaar.com.project.model.Order.OrderStatus;

public interface OrderService {
    OrderRequestDto placeOrder(OrderRequestDto dto);
    OrderRequestDto findOrderById(UUID id);
    Void cancelOrder(UUID orderId);
    OrderRequestDto changeStatus(UUID orderId, OrderStatus newStatus);
    List<OrderRequestDto> getAllOrderFromUserId(UUID userId);
} 
