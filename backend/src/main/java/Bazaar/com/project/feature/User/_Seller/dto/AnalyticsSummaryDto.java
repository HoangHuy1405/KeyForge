package Bazaar.com.project.feature.User._Seller.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsSummaryDto {
    private BigDecimal totalRevenue;
    private Integer totalOrders;
    private Integer pendingOrders;
    private Integer completedOrders;
    private List<DailyRevenueDto> revenueChart; // Last 7 days
}
