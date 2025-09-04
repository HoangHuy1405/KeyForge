package Bazaar.com.project.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import Bazaar.com.project.model.Order.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Bazaar.com.project.dto.OrderDto.OrderItemRequestDto;
import Bazaar.com.project.dto.OrderDto.OrderItemResponseDto;
import Bazaar.com.project.dto.OrderDto.OrderMapper;
import Bazaar.com.project.dto.OrderDto.OrderRequestDto;
import Bazaar.com.project.dto.OrderDto.OrderResponseDto;
import Bazaar.com.project.model.Product.Product;
import Bazaar.com.project.model.User.User;
import Bazaar.com.project.repository.OrderRepository;
import Bazaar.com.project.repository.ProductRepository;
import Bazaar.com.project.repository.UserRepository;
import Bazaar.com.project.service.interfaces.OrderService;
import jakarta.transaction.Transactional;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private OrderRepository orderRepository;

    /**
     * ensures that all operations within the method:
     * Either complete entirely, or
     * Fail and rollback everything, if any part throws a runtime exception.
     * 
     * Without @Transactional, if an error happens after inventory is deducted but
     * before
     * the order is saved, you’ll end up with corrupt data (inventory deducted, but
     * no order saved).
     */
    @Transactional
    @Override
    public OrderResponseDto placeOrder(OrderRequestDto requestDto) {
        // 1. Fetch and validate the buyer
        User buyer = userRepository.findById(requestDto.getBuyerId())
                .orElseThrow(
                        () -> new NoSuchElementException("Buyer not found with the id: " + requestDto.getBuyerId()));
        // 2. Fetch products involved
        List<UUID> productIds = requestDto.getItems().stream()
                .map(OrderItemRequestDto::getProductId)
                .toList();
        List<Product> products = productRepository.findAllById(productIds);

        // 3. Map to OrderItems
        List<OrderItem> orderItems = OrderMapper.toOrderItems(requestDto.getItems(), products);

        // 4. Create and link Order, auto calculate totalAmount
        Order order = Order.Create(buyer, requestDto.getShippingAddress(), PaymentMethod.valueOf(requestDto.getPaymentMethod().toUpperCase()), orderItems);

        // 5. Persist order
        Order savedOrder = orderRepository.save(order);

        // 6. response
        List<OrderItemResponseDto> itemResponses = OrderMapper.toOrderItemResponses(savedOrder.getItems());
        return OrderMapper.toOrderResponseDto(savedOrder, itemResponses);
    }

    @Override
    public OrderResponseDto findOrderById(UUID id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Order not found with ID: " + id));

        List<OrderItemResponseDto> itemResponseDtos = OrderMapper.toOrderItemResponses(order.getItems());
        return OrderMapper.toOrderResponseDto(order, itemResponseDtos);
    }

    @Override
    public OrderResponseDto cancelOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found with ID: " + orderId));
        order.changeOrderStatus(OrderStatus.CANCELLED);
        Order updatedOrder = orderRepository.save(order);
        List<OrderItemResponseDto> itemResponseDtos = OrderMapper.toOrderItemResponses(updatedOrder.getItems());
        return OrderMapper.toOrderResponseDto(updatedOrder, itemResponseDtos);
    }

    @Override
    public OrderResponseDto updateOrderStatus(UUID orderId, OrderStatus orderStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found with ID: " + orderId));
        order.changeOrderStatus(orderStatus);
        Order updatedOrder = orderRepository.save(order);
        List<OrderItemResponseDto> itemResponseDtos = OrderMapper.toOrderItemResponses(updatedOrder.getItems());
        return OrderMapper.toOrderResponseDto(updatedOrder, itemResponseDtos);
    }

    @Override
    public OrderResponseDto payOrder(UUID orderId){
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found with ID: " + orderId));

        // TODO: add logic paying

        order.pay();
        Order updatedOrder = orderRepository.save(order);

        List<OrderItemResponseDto> itemResponseDtos = OrderMapper.toOrderItemResponses(updatedOrder.getItems());
        return OrderMapper.toOrderResponseDto(updatedOrder, itemResponseDtos);
    }

    @Override
    public OrderResponseDto refundOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found with ID: " + orderId));

        // TODO: add logic refunding

        order.refund();
        Order updatedOrder = orderRepository.save(order);

        List<OrderItemResponseDto> itemResponseDtos = OrderMapper.toOrderItemResponses(updatedOrder.getItems());
        return OrderMapper.toOrderResponseDto(updatedOrder, itemResponseDtos);
    }

    @Override
    public List<OrderResponseDto> getAllOrderFromUserId(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new NoSuchElementException("User not found with ID: " + userId);
        }
        List<Order> orders = orderRepository.findByBuyerId(userId);
        return OrderMapper.toOrderResponseList(orders);
    }
}
