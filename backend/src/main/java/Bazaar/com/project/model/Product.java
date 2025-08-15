package Bazaar.com.project.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import Bazaar.com.project.exception.InsufficientStockException;
import Bazaar.com.project.model.UserAggregate.User;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
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
    @Column(nullable = false, length = 100)
    @NotBlank(message = "Product name is required")
    @Size(max = 100, message = "Product name must be at most 100 characters")
    private String name;

    @Column(length = 500)
    @Size(max = 500, message = "Description must be at most 500 characters")
    private String description;

    @Column(nullable = false, length = 50)
    @NotBlank(message = "Category is required")
    @Size(max = 50, message = "Category must be at most 50 characters")
    private String category;

    @Column(name = "stock_quantity", nullable = false)
    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity;

    @Column(name = "image_url")
    @Size(max = 255, message = "Image URL must be at most 255 characters")
    private String imageUrl;

    @Column(nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @Column(name = "available_quantity")
    @Min(value = 0, message = "Available quantity cannot be negative")
    private Integer availableQuantity;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ProductStatus status;

    @Column(length = 100)
    @Size(max = 100, message = "Location must be at most 100 characters")
    private String location;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = true)
    @NotNull(message = "Seller is required")
    private User seller;

    public boolean isAvailable(int quantity) {
        return quantity <= this.availableQuantity;
    }

    public void buyProduct(int quantity) {
        if (!isAvailable(quantity)) {
            throw new InsufficientStockException("Not enough stock for product: " + this.name);
        }
        this.availableQuantity -= quantity;
    }
}
