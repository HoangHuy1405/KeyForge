package Bazaar.com.project.dto.ProductDto;

import Bazaar.com.project.model.Product.Product;
import Bazaar.com.project.model.Product.ProductStatus;
import Bazaar.com.project.model.UserAggregate.User;

public class ProductMapper {
    public static Product toEntity(ProductCreateRequestDto dto, User seller, ProductStatus status) {
        return Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .stockQuantity(dto.getStockQuantity())
                .availableQuantity(dto.getStockQuantity()) // initially available quanity = stock quantity
                .price(dto.getPrice())
                .location(dto.getLocation())
                .seller(seller)
                .status(status)
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
                .price(product.getPrice())
                .status(product.getStatus())
                .location(product.getLocation())
                .sellerId(product.getSeller().getId())
                .createdAt(product.getCreatedAtLocal())
                .updatedAt(product.getUpdatedAtLocal())
                .build();
    }
}
