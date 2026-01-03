package Bazaar.com.project.feature.Order.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import Bazaar.com.project.exception.FuncErrorException;
import Bazaar.com.project.exception.UserNotFoundException;
import Bazaar.com.project.feature.Order.dto.OrderDetailResponseDto;
import Bazaar.com.project.feature.Order.dto.OrderItemResponseDto;
import Bazaar.com.project.feature.Order.dto.OrderMapper;
import Bazaar.com.project.feature.Order.dto.OrderRequestDto;
import Bazaar.com.project.feature._common.response.ResultPaginationDTO;
import Bazaar.com.project.feature.Order.dto.OrderRequestDto.OrderItemRequestDto;
import Bazaar.com.project.feature.Order.dto.OrderResponseDto;
import Bazaar.com.project.feature.Order.model.Order;
import Bazaar.com.project.feature.Order.model.OrderItem;
import Bazaar.com.project.feature.Order.model.OrderStatus;
import Bazaar.com.project.feature.Order.repository.OrderRepository;
import Bazaar.com.project.feature.Product.model.Product;
import Bazaar.com.project.feature.Product.repository.ProductRepository;
import Bazaar.com.project.feature.User.model.User;
import Bazaar.com.project.feature.User.repository.UserRepository;
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
    public OrderResponseDto placeOrder(@NonNull UUID userId, @NonNull OrderRequestDto requestDto) {
        User buyer = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Buyer not found with the id: " + userId));
        // 2. Fetch products involved
        List<UUID> productIds = requestDto.getItems().stream()
                .map(OrderItemRequestDto::getProductId)
                .toList();
        if (productIds == null || productIds.isEmpty()) {
            throw new FuncErrorException("Failed to fetch products");
        }
        List<Product> products = productRepository.findAllById(productIds);

        // 3. Map to OrderItems
        List<OrderItem> orderItems = OrderMapper.toOrderItems(requestDto.getItems(), products);

        // 4. Create and link Order, auto calculate totalAmount
        Order order = Order.Create(
                buyer,
                requestDto.getShippingAddress(),
                requestDto.getPaymentMethod(),
                requestDto.getShippingMethod(),
                requestDto.getReceiverName(),
                requestDto.getReceiverPhone(),
                orderItems);
        if (order == null) {
            throw new FuncErrorException("Failed to create order");
        }
        // 5. Persist order
        Order savedOrder = orderRepository.save(order);

        // 6. response
        List<OrderItemResponseDto> itemResponses = OrderMapper.toOrderItemResponses(savedOrder.getItems());
        return OrderMapper.toOrderResponseDto(savedOrder, itemResponses);
    }

    @Override
    public OrderResponseDto findOrderById(@NonNull UUID id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Order not found with ID: " + id));

        List<OrderItemResponseDto> itemResponseDtos = OrderMapper.toOrderItemResponses(order.getItems());
        return OrderMapper.toOrderResponseDto(order, itemResponseDtos);
    }

    @Override
    public OrderResponseDto cancelOrder(@NonNull UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found with ID: " + orderId));
        order.updateStatus(OrderStatus.CANCELLED);
        Order updatedOrder = orderRepository.save(order);
        List<OrderItemResponseDto> itemResponseDtos = OrderMapper.toOrderItemResponses(updatedOrder.getItems());
        return OrderMapper.toOrderResponseDto(updatedOrder, itemResponseDtos);
    }

    @Override
    public OrderResponseDto updateOrderStatus(@NonNull UUID orderId, OrderStatus orderStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found with ID: " + orderId));
        order.updateStatus(orderStatus);
        Order updatedOrder = orderRepository.save(order);
        List<OrderItemResponseDto> itemResponseDtos = OrderMapper.toOrderItemResponses(updatedOrder.getItems());
        return OrderMapper.toOrderResponseDto(updatedOrder, itemResponseDtos);
    }

    @Override
    public OrderResponseDto payOrder(@NonNull UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found with ID: " + orderId));

        // TODO: add logic paying

        order.pay();
        Order updatedOrder = orderRepository.save(order);

        List<OrderItemResponseDto> itemResponseDtos = OrderMapper.toOrderItemResponses(updatedOrder.getItems());
        return OrderMapper.toOrderResponseDto(updatedOrder, itemResponseDtos);
    }

    @Override
    public OrderResponseDto refundOrder(@NonNull UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found with ID: " + orderId));

        // TODO: add logic refunding

        order.refund();
        Order updatedOrder = orderRepository.save(order);

        List<OrderItemResponseDto> itemResponseDtos = OrderMapper.toOrderItemResponses(updatedOrder.getItems());
        return OrderMapper.toOrderResponseDto(updatedOrder, itemResponseDtos);
    }

    @Override
    public List<OrderResponseDto> getAllOrderFromUserId(@NonNull UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new NoSuchElementException("User not found with ID: " + userId);
        }
        List<Order> orders = orderRepository.findByBuyerId(userId);
        return OrderMapper.toOrderResponseList(orders);
    }

    @Override
    public ResultPaginationDTO getMyOrders(String currentUserEmail, Pageable pageable) {
        Page<Order> orders = orderRepository.findByCreatedBy(currentUserEmail, pageable);
        return OrderMapper.toResultPaginationDTO(orders);
    }

    @Override
    public OrderDetailResponseDto getOrderDetail(UUID orderId, String currentUserEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found with ID: " + orderId));

        // Ownership validation
        if (!order.getCreatedBy().equals(currentUserEmail)) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You do not have permission to view this order");
        }

        return OrderMapper.toOrderDetailResponseDto(order);
    }

    @Override
    public ResultPaginationDTO getOrdersBySeller(UUID sellerId, Pageable pageable) {
        Page<Order> orders = orderRepository.findOrdersBySellerIdPageable(sellerId, pageable);
        return OrderMapper.toResultPaginationDTO(orders);
    }
}
