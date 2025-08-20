package Bazaar.com.project.model.Product.embeddables;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class InventoryInfo {
    @Column(nullable = true, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity = 0;

    @Column(name = "reserved_quantity", nullable = false)
    private Integer reservedQuantity = 0; // new column; safer than storing "available"

    @Column(name = "min_order_quantity")
    private Integer minOrderQuantity = 1;

    @Column(name = "max_order_quantity")
    private Integer maxOrderQuantity; // null = unlimited

    public Integer availableQuantity() {
        return Math.max(0, (stockQuantity == null ? 0 : stockQuantity)
                - (reservedQuantity == null ? 0 : reservedQuantity));
    }

    public boolean canFulfill(int qty) {
        if (qty < (minOrderQuantity == null ? 1 : minOrderQuantity))
            return false;
        if (maxOrderQuantity != null && qty > maxOrderQuantity)
            return false;
        return qty <= availableQuantity();
    }

    public void allocate(int qty) {
        if (!canFulfill(qty))
            throw new IllegalArgumentException("Insufficient stock");
        reservedQuantity += qty; // or decrement stock directly if you prefer
    }
}
