package Bazaar.com.project.feature.Product.model.embeddables;

import Bazaar.com.project.feature.Product.enums.ProductCondition;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class ProductDetails {
    @Column(name = "brand", length = 100)
    private String brand;

    @Column(name = "model", length = 100)
    private String model;

    @Column(name = "size", length = 50)
    private String size;

    @Column(name = "material", length = 100)
    private String material;

    @Column(name = "origin", length = 100)
    private String origin;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_condition", length = 20, nullable = false)
    private ProductCondition condition = ProductCondition.NEW;
}
