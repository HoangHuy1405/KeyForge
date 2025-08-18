package Bazaar.com.project.dto.ProductDto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import Bazaar.com.project.model.ProductStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductResponseDto {
    private UUID id;
    private String name;
    private String description;
    private String category;
    private Integer stockQuantity;
    private Integer availableQuantity;
    private String imageUrl;
    private BigDecimal price;
    private ProductStatus status;
    private String location;
    private UUID sellerId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
