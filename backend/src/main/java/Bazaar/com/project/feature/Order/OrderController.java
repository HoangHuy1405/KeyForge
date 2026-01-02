package Bazaar.com.project.feature.Order;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Bazaar.com.project.exception.UserNotFoundException;
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
    public ResponseEntity<OrderResponseDto> placeOrder(@Valid @RequestBody OrderRequestDto orderDto) {
        UUID userId = SecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new UserNotFoundException("Not authenticated"));
        OrderResponseDto newOrder = orderService.placeOrder(userId, orderDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newOrder);
    }

    @GetMapping("/{id}")
    @ApiMessage("Order fetched successfully")
    public ResponseEntity<OrderResponseDto> getOrder(@PathVariable UUID id) {
        OrderResponseDto order = orderService.findOrderById(id);
        return ResponseEntity.status(HttpStatus.OK).body(order);
    }

    @PatchMapping("/{id}/cancel")
    @ApiMessage("Order cancelled successfully")
    public ResponseEntity<OrderResponseDto> cancelOrder(@PathVariable UUID id) {
        OrderResponseDto order = orderService.cancelOrder(id);
        return ResponseEntity.status(HttpStatus.OK).body(order);
    }

    @PatchMapping("/{id}/order-status")
    @ApiMessage("Order cancelled successfully")
    public ResponseEntity<OrderResponseDto> updateStatus(
            @PathVariable UUID id,
            @RequestBody OrderStatusUpdateRequest request) {
        OrderResponseDto order = orderService.updateOrderStatus(id, request.getStatus());
        return ResponseEntity.status(HttpStatus.OK).body(order);
    }

    @PatchMapping("/{id}/pay")
    @ApiMessage("Order paid successfully")
    public ResponseEntity<OrderResponseDto> payOrder(@PathVariable UUID id) {
        OrderResponseDto order = orderService.payOrder(id);
        return ResponseEntity.status(HttpStatus.OK).body(order);
    }

    @PatchMapping("/{id}/refund")
    @ApiMessage("Order refunded successfully")
    public ResponseEntity<OrderResponseDto> refundOrder(@PathVariable UUID id) {
        OrderResponseDto order = orderService.refundOrder(id);
        return ResponseEntity.status(HttpStatus.OK).body(order);
    }
}
