package Bazaar.com.project.feature.Order.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import Bazaar.com.project.feature.Order.model.Order;
import Bazaar.com.project.feature.Order.model.OrderItem;
import Bazaar.com.project.feature.Product.model.Product;

public class OrderMapper {
    public static List<OrderItem> toOrderItems(List<OrderItemRequestDto> itemDtos, List<Product> products) {
        List<OrderItem> orderItems = new ArrayList<>();
        for (OrderItemRequestDto dto : itemDtos) {
            Product product = products.stream()
                    .filter(p -> p.getId().equals(dto.getProductId()))
                    .findFirst()
                    .orElseThrow(
                            () -> new IllegalArgumentException("Product not found with ID: " + dto.getProductId()));

            product.buyProduct(dto.getQuantity());

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setQuantity(dto.getQuantity());
            item.initializeFromProduct();

            orderItems.add(item);
        }

        return orderItems;
    }

    public static List<OrderItemResponseDto> toOrderItemResponses(List<OrderItem> orderItems) {
        return orderItems.stream()
                .map(item -> {
                    Product product = item.getProduct();
                    return OrderItemResponseDto.builder()
                            .productId(product.getId())
                            .productName(product.getName())
                            .quantity(item.getQuantity())
                            .unitPrice(item.getUnitPrice())
                            .subtotal(item.getSubtotal())
                            .build();
                })
                .collect(Collectors.toList());
    }

    public static OrderResponseDto toOrderResponseDto(Order order, List<OrderItemResponseDto> items) {
        return OrderResponseDto.builder()
                .orderId(order.getId())
                .buyerId(order.getBuyer().getId())
                .buyerName(order.getBuyer().getFullname())
                .shippingAddress(order.getShippingAddress())
                .totalAmount(order.getTotalAmount())
                .paymentMethod(order.getPaymentMethod())
                .orderStatus(order.getOrderStatus())
                .paymentStatus(order.getPaymentStatus())
                .createdAt(order.getCreatedAtLocal())
                .items(items)
                .build();
    }

    public static List<OrderResponseDto> toOrderResponseList(List<Order> orders) {
        return orders.stream()
                .map(order -> toOrderResponseDto(order, toOrderItemResponses(order.getItems())))
                .toList();
    }

}
