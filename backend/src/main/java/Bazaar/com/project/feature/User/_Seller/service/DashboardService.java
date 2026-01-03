package Bazaar.com.project.feature.User._Seller.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Bazaar.com.project.feature.Order.model.Order;
import Bazaar.com.project.feature.Order.model.OrderStatus;
import Bazaar.com.project.feature.Order.repository.OrderRepository;
import Bazaar.com.project.feature.User._Seller.dto.AnalyticsSummaryDto;
import Bazaar.com.project.feature.User._Seller.dto.DailyRevenueDto;

@Service
public class DashboardService {
    @Autowired
    private OrderRepository orderRepository;

    /**
     * Get analytics summary for a seller
     * Includes total revenue, order counts, and revenue chart for last 7 days
     */
    public AnalyticsSummaryDto getAnalyticsSummary(UUID sellerId) {
        // Get all orders containing this seller's products
        List<Order> allOrders = orderRepository.findOrdersBySellerId(sellerId);

        // Calculate totals
        BigDecimal totalRevenue = allOrders.stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.COMPLETED 
                        || order.getOrderStatus() == OrderStatus.DELIVERED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalOrders = allOrders.size();
        
        long pendingOrders = allOrders.stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.PENDING 
                        || order.getOrderStatus() == OrderStatus.PROCESSING)
                .count();

        long completedOrders = allOrders.stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.COMPLETED 
                        || order.getOrderStatus() == OrderStatus.DELIVERED)
                .count();

        // Generate revenue chart for last 7 days
        List<DailyRevenueDto> revenueChart = generateRevenueChart(allOrders, 7);

        return AnalyticsSummaryDto.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .pendingOrders((int) pendingOrders)
                .completedOrders((int) completedOrders)
                .revenueChart(revenueChart)
                .build();
    }

    /**
     * Generate daily revenue data for the last N days
     */
    private List<DailyRevenueDto> generateRevenueChart(List<Order> orders, int days) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minus(days - 1, ChronoUnit.DAYS);

        // Group orders by date
        Map<LocalDate, List<Order>> ordersByDate = orders.stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.COMPLETED 
                        || order.getOrderStatus() == OrderStatus.DELIVERED)
                .filter(order -> {
                    Instant completedAt = order.getCompletedAt() != null 
                            ? order.getCompletedAt() 
                            : order.getDeliveredAt();
                    if (completedAt == null) return false;
                    LocalDate orderDate = completedAt.atZone(ZoneId.systemDefault()).toLocalDate();
                    return !orderDate.isBefore(startDate);
                })
                .collect(Collectors.groupingBy(order -> {
                    Instant completedAt = order.getCompletedAt() != null 
                            ? order.getCompletedAt() 
                            : order.getDeliveredAt();
                    return completedAt.atZone(ZoneId.systemDefault()).toLocalDate();
                }));

        // Create data points for each day
        List<DailyRevenueDto> chart = new ArrayList<>();
        for (int i = 0; i < days; i++) {
            LocalDate date = startDate.plus(i, ChronoUnit.DAYS);
            List<Order> dayOrders = ordersByDate.getOrDefault(date, List.of());
            
            BigDecimal dayRevenue = dayOrders.stream()
                    .map(Order::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            chart.add(DailyRevenueDto.builder()
                    .date(date)
                    .revenue(dayRevenue)
                    .orderCount(dayOrders.size())
                    .build());
        }

        return chart;
    }
}
