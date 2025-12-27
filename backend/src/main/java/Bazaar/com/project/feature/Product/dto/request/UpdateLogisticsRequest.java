package Bazaar.com.project.feature.Product.dto.request;

/**
 * Request DTO for updating product logistics (Step 3).
 * After this step, product can become ACTIVE.
 */
public record UpdateLogisticsRequest(
        String location,
        Boolean supportFastShipping,
        Boolean supportRegularShipping,
        Boolean supportEconomyShipping) {
}
