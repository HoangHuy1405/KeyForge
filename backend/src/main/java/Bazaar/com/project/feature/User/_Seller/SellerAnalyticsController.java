package Bazaar.com.project.feature.User._Seller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Bazaar.com.project.exception.UserNotFoundException;
import Bazaar.com.project.feature.User._Seller.dto.AnalyticsSummaryDto;
import Bazaar.com.project.feature.User._Seller.service.DashboardService;
import Bazaar.com.project.feature._common.annotation.ApiMessage;
import Bazaar.com.project.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/seller/analytics")
@Tag(name = "Seller Analytics", description = "Analytics and dashboard data for sellers")
@PreAuthorize("hasAnyAuthority('SELLER', 'ADMIN')")
public class SellerAnalyticsController {

    @Autowired
    private DashboardService dashboardService;

    @Operation(summary = "Get analytics summary", description = "Returns revenue, order counts, and 7-day revenue chart for the current seller")
    @GetMapping("/summary")
    @ApiMessage("Analytics summary fetched successfully")
    public ResponseEntity<AnalyticsSummaryDto> getAnalyticsSummary() {
        UUID sellerId = SecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new UserNotFoundException("Not authenticated"));

        AnalyticsSummaryDto summary = dashboardService.getAnalyticsSummary(sellerId);
        return ResponseEntity.ok(summary);
    }
}
