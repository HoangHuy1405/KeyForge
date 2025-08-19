package Bazaar.com.project.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Bazaar.com.project.dto.OrderDto.OrderItemRequestDto;
import Bazaar.com.project.dto.OrderDto.OrderItemResponseDto;
import Bazaar.com.project.dto.OrderDto.OrderMapper;
import Bazaar.com.project.dto.OrderDto.OrderRequestDto;
import Bazaar.com.project.dto.OrderDto.OrderResponseDto;
import Bazaar.com.project.model.Order.Order;
import Bazaar.com.project.model.Order.OrderItem;
import Bazaar.com.project.model.Order.OrderStatus;
import Bazaar.com.project.model.Order.PaymentMethod;
import Bazaar.com.project.model.Product.Product;
import Bazaar.com.project.model.UserAggregate.User;
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

        // 3. Map to OrderItems and calculate total
        List<OrderItem> orderItems = OrderMapper.toOrderItems(requestDto.getItems(), products);
        BigDecimal totalAmount = orderItems.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 4. Create and link Order
        Order order = new Order();
        order.setBuyer(buyer);
        order.setShippingAddress(requestDto.getShippingAddress());
        order.setStatus(OrderStatus.PROCESSING);
        order.setPaymentMethod(PaymentMethod.valueOf(requestDto.getPaymentMethod().toUpperCase()));
        order.setTotalAmount(totalAmount);
        order.setItems(orderItems);

        // Set back-reference from each OrderItem
        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }

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
        order.changeStatus(OrderStatus.CANCELLED);
        Order updatedOrder = orderRepository.save(order);
        List<OrderItemResponseDto> itemResponseDtos = OrderMapper.toOrderItemResponses(updatedOrder.getItems());
        return OrderMapper.toOrderResponseDto(updatedOrder, itemResponseDtos);
    }

    @Override
    public OrderResponseDto changeStatus(UUID orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found with ID: " + orderId));
        order.changeStatus(newStatus);
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
