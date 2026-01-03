package Bazaar.com.project.feature.Order.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import Bazaar.com.project.feature.Order.dto.OrderDetailResponseDto.OrderItemDetailDto;
import Bazaar.com.project.feature.Order.dto.OrderListItemDto.OrderItemSummaryDto;
import Bazaar.com.project.feature.Order.dto.OrderRequestDto.OrderItemRequestDto;
import Bazaar.com.project.feature.Order.model.Order;
import Bazaar.com.project.feature.Order.model.OrderItem;
import Bazaar.com.project.feature.Product.model.Product;
import Bazaar.com.project.feature._common.response.Meta;
import Bazaar.com.project.feature._common.response.ResultPaginationDTO;
import org.springframework.data.domain.Page;

public class OrderMapper {
        public static List<OrderItem> toOrderItems(List<OrderItemRequestDto> itemDtos, List<Product> products) {
                List<OrderItem> orderItems = new ArrayList<>();
                for (OrderItemRequestDto dto : itemDtos) {
                        Product product = products.stream()
                                        .filter(p -> p.getId().equals(dto.getProductId()))
                                        .findFirst()
                                        .orElseThrow(
                                                        () -> new IllegalArgumentException("Product not found with ID: "
                                                                        + dto.getProductId()));

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

        /**
         * Maps Order to lightweight list item DTO
         */
        public static OrderListItemDto toOrderListItemDto(Order order) {
                List<OrderItemSummaryDto> itemSummaries = order.getItems().stream()
                                .map(item -> {
                                        Product product = item.getProduct();
                                        // Fix: Check product images safely
                                        String thumbnail = (product.getImages() != null
                                                        && !product.getImages().isEmpty())
                                                                        ? product.getImages().get(0).getUrl()
                                                                        : product.getThumbnailUrl(); // Fallback to
                                                                                                     // thumbnail url
                                                                                                     // directly on
                                                                                                     // product if
                                                                                                     // available
                                        return OrderItemSummaryDto.builder()
                                                        .productName(product.getName())
                                                        .quantity(item.getQuantity())
                                                        .thumbnailUrl(thumbnail)
                                                        .unitPrice(item.getUnitPrice())
                                                        .subtotal(item.getSubtotal())
                                                        .build();
                                })
                                .collect(Collectors.toList());

                return OrderListItemDto.builder()
                                .orderId(order.getId())
                                .orderStatus(order.getOrderStatus())
                                .totalAmount(order.getTotalAmount())
                                .createdAt(order.getCreatedAt())
                                .items(itemSummaries)
                                .build();
        }

        /**
         * Maps Order to detailed DTO with all timestamps
         */
        public static OrderDetailResponseDto toOrderDetailResponseDto(Order order) {
                List<OrderItemDetailDto> itemDetails = order.getItems().stream()
                                .map(item -> {
                                        Product product = item.getProduct();
                                        // Fix: Check product images safely
                                        String thumbnail = (product.getImages() != null
                                                        && !product.getImages().isEmpty())
                                                                        ? product.getImages().get(0).getUrl()
                                                                        : product.getThumbnailUrl(); // Fallback to
                                                                                                     // thumbnail url
                                                                                                     // directly on
                                                                                                     // product if
                                                                                                     // available
                                        return OrderItemDetailDto.builder()
                                                        .productId(product.getId())
                                                        .productName(product.getName())
                                                        .thumbnailUrl(thumbnail)
                                                        .quantity(item.getQuantity())
                                                        .unitPrice(item.getUnitPrice())
                                                        .subtotal(item.getSubtotal())
                                                        .build();
                                })
                                .collect(Collectors.toList());

                return OrderDetailResponseDto.builder()
                                .orderId(order.getId())
                                .buyerId(order.getBuyer().getId())
                                .buyerName(order.getBuyer().getFullname())
                                .shippingAddress(order.getShippingAddress())
                                .receiverName(order.getReceiverName())
                                .receiverPhone(order.getReceiverPhone())
                                .shippingMethod(order.getShippingMethod())
                                .orderStatus(order.getOrderStatus())
                                .totalAmount(order.getTotalAmount())
                                .items(itemDetails)
                                .paymentMethod(order.getPaymentMethod())
                                .paymentStatus(order.getPaymentStatus())
                                .createdAt(order.getCreatedAt())
                                .processingAt(order.getProcessingAt())
                                .shippedAt(order.getShippedAt())
                                .deliveredAt(order.getDeliveredAt())
                                .completedAt(order.getCompletedAt())
                                .cancelledAt(order.getCancelledAt())
                                .build();
        }

        public static ResultPaginationDTO toResultPaginationDTO(Page<Order> page) {
                ResultPaginationDTO result = new ResultPaginationDTO();
                Meta meta = new Meta();
                meta.setPage(page.getNumber());
                meta.setPageSize(page.getSize());
                meta.setPages(page.getTotalPages());
                meta.setTotal(page.getTotalElements());

                result.setMeta(meta);
                result.setResult(page.getContent().stream()
                                .map(OrderMapper::toOrderListItemDto)
                                .collect(Collectors.toList()));

                return result;
        }
}
