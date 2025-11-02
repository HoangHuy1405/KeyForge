package Bazaar.com.project.feature.Product._ProductMedia.model;

import Bazaar.com.project.feature.Product.model.Product;
import Bazaar.com.project.feature._common.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "product_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImage extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    @Column(name = "url", length = 255, nullable = false)
    private String url;
    @Column(name = "public_id", length = 255, nullable = false)
    private String publicId;
    @Column(name = "version")
    private Long version;
    /** Optional explicit ordering for your gallery grid */
    @Column(name = "sort_order")
    private Integer sortOrder;
}
