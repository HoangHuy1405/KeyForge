package Bazaar.com.project.feature.Product.model.embeddables;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Logistics and shipping information for products.
 * Used for shipping cost calculation and fulfillment.
 * 
 * Note: Pre-order status is now handled by StockStatus enum,
 * not in this class.
 */
@Embeddable
@Getter
@Setter
public class LogisticsInfo {
    /** Seller/warehouse location for fulfillment */
    @Column(length = 100)
    private String location;

    /** Supported shipping methods */
    @Embedded
    private ShippingOptions shipping = new ShippingOptions();

    @Embeddable
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ShippingOptions {
        @Column(name = "support_fast_shipping")
        private Boolean fast = false;
        @Column(name = "support_regular_shipping")
        private Boolean regular = true;
        @Column(name = "support_economy_shipping")
        private Boolean economy = false;
    }
}
