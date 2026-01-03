package Bazaar.com.project.feature.User._Seller.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyRevenueDto {
    private LocalDate date;
    private BigDecimal revenue;
    private Integer orderCount;
}
