package Bazaar.com.project.feature.Product.dto.request;

import jakarta.validation.constraints.Size;

public record UpdateLogisticsRequest(
                Integer weightGrams,
                Integer lengthCm,
                Integer widthCm,
                Integer heightCm,
                @Size(max = 100) String location,
                Boolean preOrder,
                Integer preOrderLeadTimeDays,
                Boolean supportFastShipping,
                Boolean supportRegularShipping,
                Boolean supportEconomyShipping) {
}
