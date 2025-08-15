package Bazaar.com.project.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Bazaar.com.project.dto.OrderDto.OrderRequestDto;
import Bazaar.com.project.dto.OrderDto.OrderResponseDto;
import Bazaar.com.project.dto.OrderDto.OrderStatusUpdateRequest;
import Bazaar.com.project.service.interfaces.OrderService;
import Bazaar.com.project.util.Annotation.ApiMessage;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping
    @ApiMessage("Order created successfully")
    public ResponseEntity<OrderResponseDto> placeOrder(@Valid @RequestBody OrderRequestDto orderDto) {
        OrderResponseDto newOrder = orderService.placeOrder(orderDto);
        // ApiResponse<OrderResponseDto> response = new ApiResponse<>(
        // HttpStatus.CREATED,
        // "Order created successfully",
        // newOrder,
        // String.valueOf(HttpStatus.CREATED.value())
        // );
        return ResponseEntity.status(HttpStatus.CREATED).body(newOrder);
    }

    @GetMapping("/{id}")
    @ApiMessage("Order fetched successfully")
    public ResponseEntity<OrderResponseDto> getOrder(@PathVariable UUID id) {
        OrderResponseDto order = orderService.findOrderById(id);
        // ApiResponse<OrderResponseDto> response = new ApiResponse<>(
        // HttpStatus.OK,
        // "Order fetched successfully",
        // order,
        // String.valueOf(HttpStatus.OK.value())
        // );
        return ResponseEntity.status(HttpStatus.OK).body(order);
    }

    @PatchMapping("/{id}/cancel")
    @ApiMessage("Order cancelled successfully")
    public ResponseEntity<OrderResponseDto> cancelOrder(@PathVariable UUID id) {
        OrderResponseDto order = orderService.cancelOrder(id);
        // ApiResponse<OrderResponseDto> response = new ApiResponse<>(
        // HttpStatus.OK,
        // "Order cancelled successfully",
        // order,
        // String.valueOf(HttpStatus.OK.value())
        // );
        return ResponseEntity.status(HttpStatus.OK).body(order);
    }

    @PatchMapping("/{id}/status")
    @ApiMessage("Order cancelled successfully")
    public ResponseEntity<OrderResponseDto> updateStatus(
            @PathVariable UUID id,
            @RequestBody OrderStatusUpdateRequest request) {
        OrderResponseDto order = orderService.changeStatus(id, request.getStatus());
        // ApiResponse<OrderResponseDto> response = new ApiResponse<>(
        // HttpStatus.OK,
        // "Status updated successfully",
        // order,
        // String.valueOf(HttpStatus.OK.value())
        // );
        return ResponseEntity.status(HttpStatus.OK).body(order);
    }
}
