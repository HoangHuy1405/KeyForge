package Bazaar.com.project.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Bazaar.com.project.dto.OrderDto.OrderResponseDto;
import Bazaar.com.project.service.interfaces.OrderService;
import Bazaar.com.project.util.Annotation.ApiMessage;

@RestController
@RequestMapping("api/users")
public class UserController {
    @Autowired
    private OrderService orderService;
    
    @GetMapping("/{userId}/orders")
    @ApiMessage("Orders of user fetch successfully")
    public ResponseEntity<List<OrderResponseDto>> getOrdersByUserId(@PathVariable UUID userId) {
        List<OrderResponseDto> orders = orderService.getAllOrderFromUserId(userId);
        return ResponseEntity.ok().body(orders);
    }
}
