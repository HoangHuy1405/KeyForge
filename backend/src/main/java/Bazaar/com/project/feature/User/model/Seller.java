package Bazaar.com.project.feature.User.model;

import Bazaar.com.project.feature._common.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "sellers")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Seller extends BaseEntity {
    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;
    private String address;
    private String storeName;
    private String email;
    private String phoneNum;
    private double rating;
    @Embedded
    @Builder.Default
    private ShippingOptions shippingOptions = new ShippingOptions();

    @Embeddable
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ShippingOptions {
        @Column(name = "support_fast_shipping")
        private Boolean express = false;
        @Column(name = "support_regular_shipping")
        private Boolean standard = true;
        @Column(name = "support_economy_shipping")
        private Boolean economy = false;
    }
}
