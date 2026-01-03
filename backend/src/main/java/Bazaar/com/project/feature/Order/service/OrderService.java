package Bazaar.com.project.feature.Order.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;

import Bazaar.com.project.feature.Order.dto.OrderDetailResponseDto;
import Bazaar.com.project.feature.Order.dto.OrderRequestDto;
import Bazaar.com.project.feature.Order.dto.OrderResponseDto;
import Bazaar.com.project.feature.Order.model.OrderStatus;
import Bazaar.com.project.feature._common.response.ResultPaginationDTO;

public interface OrderService {
    OrderResponseDto placeOrder(@NonNull UUID userId, @NonNull OrderRequestDto dto);

    OrderResponseDto findOrderById(@NonNull UUID id);

    OrderResponseDto cancelOrder(@NonNull UUID orderId);

    OrderResponseDto updateOrderStatus(@NonNull UUID orderId, OrderStatus newStatus);

    OrderResponseDto payOrder(@NonNull UUID orderId);

    OrderResponseDto refundOrder(@NonNull UUID orderId);

    List<OrderResponseDto> getAllOrderFromUserId(@NonNull UUID userId);

    /**
     * Get paginated list of orders for the current user
     */
    ResultPaginationDTO getMyOrders(String currentUserEmail, Pageable pageable);

    /**
     * Get detailed order info with ownership validation
     * 
     * @throws AccessDeniedException if user is not the owner
     */
    OrderDetailResponseDto getOrderDetail(UUID orderId, String currentUserEmail);

    /**
     * Get paginated list of orders for a seller (orders containing their products)
     */
    ResultPaginationDTO getOrdersBySeller(UUID sellerId, Pageable pageable);
}
