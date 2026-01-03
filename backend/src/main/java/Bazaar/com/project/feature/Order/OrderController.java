package Bazaar.com.project.feature.Order;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Bazaar.com.project.feature._common.response.ResultPaginationDTO;
import Bazaar.com.project.exception.UserNotFoundException;
import Bazaar.com.project.feature.Order.dto.OrderDetailResponseDto;
import Bazaar.com.project.feature.Order.dto.OrderRequestDto;
import Bazaar.com.project.feature.Order.dto.OrderResponseDto;
import Bazaar.com.project.feature.Order.dto.OrderStatusUpdateRequest;
import Bazaar.com.project.feature.Order.service.OrderService;
import Bazaar.com.project.feature._common.annotation.ApiMessage;
import Bazaar.com.project.util.SecurityUtil;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping
    @ApiMessage("Order created successfully")
    public OrderResponseDto placeOrder(@Valid @RequestBody OrderRequestDto orderDto) {
        UUID userId = SecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new UserNotFoundException("Not authenticated"));
        return orderService.placeOrder(userId, orderDto);
    }

    /**
     * Get paginated list of orders for the current user
     */
    @GetMapping("/my-orders")
    @ApiMessage("Orders fetched successfully")
    public ResultPaginationDTO getMyOrders(
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        String currentUserEmail = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new UserNotFoundException("Not authenticated"));
        return orderService.getMyOrders(currentUserEmail, pageable);
    }

    /**
     * Get detailed order info (ownership validated in service)
     */
    @GetMapping("/{id}")
    @ApiMessage("Order fetched successfully")
    public OrderDetailResponseDto getOrderDetail(@PathVariable UUID id) {
        String currentUserEmail = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new UserNotFoundException("Not authenticated"));
        return orderService.getOrderDetail(id, currentUserEmail);
    }

    @PatchMapping("/{id}/cancel")
    @ApiMessage("Order cancelled successfully")
    public OrderResponseDto cancelOrder(@PathVariable UUID id) {
        return orderService.cancelOrder(id);
    }

    @PatchMapping("/{id}/order-status")
    @ApiMessage("Order status updated successfully")
    public OrderResponseDto updateStatus(
            @PathVariable UUID id,
            @RequestBody OrderStatusUpdateRequest request) {
        return orderService.updateOrderStatus(id, request.getStatus());
    }

    @PatchMapping("/{id}/pay")
    @ApiMessage("Order paid successfully")
    public OrderResponseDto payOrder(@PathVariable UUID id) {
        return orderService.payOrder(id);
    }

    @PatchMapping("/{id}/refund")
    @ApiMessage("Order refunded successfully")
    public OrderResponseDto refundOrder(@PathVariable UUID id) {
        return orderService.refundOrder(id);
    }

    /**
     * Get paginated list of orders for the current seller
     */
    @GetMapping("/seller-orders")
    @ApiMessage("Seller orders fetched successfully")
    public ResultPaginationDTO getSellerOrders(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        UUID sellerId = SecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new UserNotFoundException("Not authenticated"));
        return orderService.getOrdersBySeller(sellerId, pageable);
    }
}
