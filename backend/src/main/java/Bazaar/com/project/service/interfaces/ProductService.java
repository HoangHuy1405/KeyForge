package Bazaar.com.project.service.interfaces;

import java.util.List;
import java.util.UUID;

import Bazaar.com.project.dto.ProductDto.ProductCreateRequestDto;
import Bazaar.com.project.dto.ProductDto.ProductResponseDto;
import Bazaar.com.project.model.ProductStatus;

public interface ProductService {
    ProductResponseDto createProduct(ProductCreateRequestDto product);
    ProductResponseDto findProductById(UUID id);
    List<ProductResponseDto> getAllProduct();
    ProductResponseDto updateProduct(UUID id, ProductCreateRequestDto updatedProduct);
    void deleteProduct(UUID id);
    void increaseStock(UUID productId, int quantity);
    void decreaseStock(UUID productId, int quantity);
    List<ProductResponseDto> findProductsBySeller(UUID sellerId);
    void changeStatus(UUID id, ProductStatus status);
}
