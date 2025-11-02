package Bazaar.com.project.feature.Product.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import Bazaar.com.project.feature.Product._ProductMedia.model.ProductImage;
import Bazaar.com.project.feature.Product.enums.ProductCategory;
import Bazaar.com.project.feature.Product.enums.ProductStatus;
import Bazaar.com.project.feature.Product.model.embeddables.InventoryInfo;
import Bazaar.com.project.feature.Product.model.embeddables.LogisticsInfo;
import Bazaar.com.project.feature.Product.model.embeddables.ProductDetails;
import Bazaar.com.project.feature.User.model.User;
import Bazaar.com.project.feature._common.model.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends BaseEntity {
    /* Basic information */
    @Column(nullable = false, length = 100)
    @NotBlank
    @Size(max = 100)
    private String name;

    @Column(length = 500)
    @Size(max = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private ProductCategory category;

    /* Detailed information (embeddable) */
    @Embedded
    @Builder.Default
    private ProductDetails details = new ProductDetails();

    /* Sell information */
    @Embedded
    @Builder.Default
    private InventoryInfo inventory = new InventoryInfo();

    /* Logistics (weight, dims, shipping, preorder, location) */
    @Embedded
    @Builder.Default
    private LogisticsInfo logistics = new LogisticsInfo();

    /* Other (not for input) */
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ProductStatus status;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    @NotNull
    private User seller;

    /*
     * Image information
     * https://res.cloudinary.com/<cloudName>/<assetType>/upload/<optional-
     * transforms>/v<version>/<publicId>
     */
    @Column(name = "thumbnail_url", length = 255)
    private String thumbnailUrl;
    @Column(name = "thumbnail_public_id", length = 255)
    private String thumbnailPublicId;
    @Column(name = "thumbnail_version")
    private Long thumbnailVersion;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC, createdAt ASC")
    @Builder.Default
    private List<ProductImage> images = new ArrayList<>();

    public boolean isAvailable(int quantity) {
        return inventory != null && inventory.canFulfill(quantity);
    }

    public void buyProduct(int quantity) {
        inventory.allocate(quantity); // trans
    }
}
