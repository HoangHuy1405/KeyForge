package Bazaar.com.project.feature.Order.model;

import java.math.BigDecimal;

/**
 * Shipping methods with associated fees in USD
 */
public enum ShippingMethod {
    ECONOMY(new BigDecimal("5.00")), // $5 economy shipping
    STANDARD(new BigDecimal("10.00")), // $10 standard shipping
    EXPRESS(new BigDecimal("20.00")); // $20 express shipping

    private final BigDecimal fee;

    ShippingMethod(BigDecimal fee) {
        this.fee = fee;
    }

    public BigDecimal getFee() {
        return fee;
    }
}
