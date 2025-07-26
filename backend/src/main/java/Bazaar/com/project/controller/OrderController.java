package Bazaar.com.project.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Bazaar.com.project.dto.OrderRequestDto;
import Bazaar.com.project.service.interfaces.OrderService;
import Bazaar.com.project.util.ApiResponse;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/orders")
public class OrderController {
//    @Autowired
//    private OrderService orderSerivce;
//
//    @PostMapping
//    public ResponseEntity<ApiResponse<OrderRequestDto>> placeOrder(@Valid @RequestBody OrderRequestDto orderDto) {
//        OrderRequestDto newOrder =  orderSerivce.placeOrder(orderDto);
//        ApiResponse<OrderRequestDto> response = new ApiResponse<>(
//            HttpStatus.CREATED,
//            "Order created successfully",
//            newOrder,
//            String.valueOf(HttpStatus.CREATED.value())
//        );
//        return ResponseEntity.status(HttpStatus.CREATED).body(response);
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<ApiResponse<OrderRequestDto>> getOrder(@PathVariable UUID id) {
//        OrderRequestDto order = orderSerivce.findOrderById(id);
//        ApiResponse<OrderRequestDto> response = new ApiResponse<>(
//            HttpStatus.OK,
//            "Order fetched successfully",
//            order,
//            String.valueOf(HttpStatus.OK.value())
//        );
//        return ResponseEntity.status(HttpStatus.OK).body(response);
//    }
}
