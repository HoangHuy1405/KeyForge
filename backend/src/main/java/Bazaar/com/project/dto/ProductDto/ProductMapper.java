package Bazaar.com.project.dto.ProductDto;

import Bazaar.com.project.model.Product;
import Bazaar.com.project.model.ProductStatus;
import Bazaar.com.project.model.UserAggregate.User;

public class ProductMapper {
     public static Product toEntity(ProductCreateRequestDto dto, User seller) {
        return Product.builder()
            .name(dto.getName())
            .description(dto.getDescription())
            .category(dto.getCategory())
            .stockQuantity(dto.getStockQuantity())
            .availableQuantity(dto.getStockQuantity()) // initially available quanity = stock quantity
            .imageUrl(dto.getImageUrl())
            .price(dto.getPrice())
            .location(dto.getLocation())
            .seller(seller)
            .status(ProductStatus.ACTIVE) // Default status
            .build();
    }
    public static ProductResponseDto toResponse(Product product) {
        return ProductResponseDto.builder()
            .id(product.getId())
            .name(product.getName())
            .description(product.getDescription())
            .category(product.getCategory())
            .stockQuantity(product.getStockQuantity())
            .availableQuantity(product.getAvailableQuantity())
            .imageUrl(product.getImageUrl())
            .price(product.getPrice())
            .status(product.getStatus())
            .location(product.getLocation())
            .sellerId(product.getSeller().getId())
            .createdAt(product.getCreatedAt())
            .updatedAt(product.getUpdatedAt())
            .build();
    }
}
