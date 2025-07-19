package Bazaar.com.project.service.interfaces;

import java.util.List;
import java.util.UUID;

import Bazaar.com.project.model.Product;

public interface ProductService {
    Product createProduct(Product product);
    Product findProductById(UUID id);
    List<Product> getAllProduct();
    Product updateProduct(UUID id, Product updatedProduct);
    void deleteProduct(UUID id);
    void increaseStock(UUID productId, int quantity);
    void decreaseStock(UUID productId, int quantity);
    List<Product> findProductsBySeller(UUID sellerId);
}
