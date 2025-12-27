package Bazaar.com.project.feature.Product.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.annotations.Type;

import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import Bazaar.com.project.feature.Product._ProductMedia.model.ProductImage;
import Bazaar.com.project.feature.Product.enums.ProductCategory;
import Bazaar.com.project.feature.Product.enums.ProductCondition;
import Bazaar.com.project.feature.Product.enums.ProductStatus;
import Bazaar.com.project.feature.Product.enums.StockStatus;
import Bazaar.com.project.feature.Product.model.embeddables.InventoryInfo;
import Bazaar.com.project.feature.Product.model.embeddables.LogisticsInfo;
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

/**
 * KeyForge Product entity for mechanical keyboard marketplace.
 * Uses JSONB for category-specific technical attributes.
 */
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

    @Column(length = 2000)
    @Size(max = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    @NotNull
    private ProductCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_condition", nullable = false, length = 20)
    @NotNull
    @Builder.Default
    private ProductCondition productCondition = ProductCondition.NEW;

    /* Stock status for Group Buy lifecycle */
    @Enumerated(EnumType.STRING)
    @Column(name = "stock_status", length = 30)
    @Builder.Default
    private StockStatus stockStatus = StockStatus.IN_STOCK;

    /**
     * Dynamic category-specific attributes stored as JSONB.
     * - For SWITCH: type, actuationForce, totalTravel, pins, manufacturer,
     * soundSignature
     * - For KEYBOARD_KIT: layout, caseMaterial, plateMaterial, mountingStyle,
     * connectivity, hotswap
     * - For KEYCAP: profile, material, legendType, compatibleLayouts
     * - For STABILIZER: mountType, size, material
     */
    @Type(JsonType.class)
    @Column(name = "attributes", columnDefinition = "jsonb")
    @Builder.Default
    private Map<String, Object> attributes = new HashMap<>();

    /* Sell information */
    @Embedded
    @Builder.Default
    private InventoryInfo inventory = new InventoryInfo();

    /* Logistics (weight, dims, shipping, preorder, location) */
    @Embedded
    @Builder.Default
    private LogisticsInfo logistics = new LogisticsInfo();

    /* Internal status (not for input) */
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private ProductStatus status = ProductStatus.DRAFT;

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

    // ===== Helper methods =====

    public boolean isAvailable(int quantity) {
        return inventory != null && inventory.canFulfill(quantity);
    }

    public void buyProduct(int quantity) {
        inventory.allocate(quantity);
    }

    /**
     * Get a typed attribute from the JSONB column.
     * 
     * @param key   The attribute key
     * @param clazz The expected type
     * @return The attribute value or null if not found
     */
    @SuppressWarnings("unchecked")
    public <T> T getAttribute(String key, Class<T> clazz) {
        Object value = attributes.get(key);
        if (value == null)
            return null;
        if (clazz.isInstance(value))
            return (T) value;
        return null;
    }

    /**
     * Set an attribute in the JSONB column.
     */
    public void setAttribute(String key, Object value) {
        if (attributes == null) {
            attributes = new HashMap<>();
        }
        attributes.put(key, value);
    }
}
