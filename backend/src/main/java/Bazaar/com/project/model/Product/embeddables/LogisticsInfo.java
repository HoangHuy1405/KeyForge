package Bazaar.com.project.model.Product.embeddables;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class LogisticsInfo {
    @Column(name = "weight_grams")
    private Integer weightGrams;

    @Embedded
    private Dimensions dimensions = new Dimensions();

    @Column(length = 100)
    private String location;

    @Column(name = "pre_order")
    private Boolean preOrder = false;

    @Column(name = "pre_order_lead_time_days")
    private Integer preOrderLeadTimeDays;

    @Embedded
    private ShippingOptions shipping = new ShippingOptions();

    @Embeddable
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Dimensions {
        @Column(name = "length_cm")
        private Integer lengthCm;
        @Column(name = "width_cm")
        private Integer widthCm;
        @Column(name = "height_cm")
        private Integer heightCm;
    }

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
