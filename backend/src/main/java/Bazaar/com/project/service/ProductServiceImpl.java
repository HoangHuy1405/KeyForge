package Bazaar.com.project.service;

import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Bazaar.com.project.model.Product;
import Bazaar.com.project.repository.ProductRepository;
import Bazaar.com.project.service.interfaces.ProductService;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Override
    public Product createProduct(Product product) {
        return this.productRepository.save(product);
    }
    @Override
    public Product findProductById(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Product not found with ID: " + id));
    }
    @Override
    public List<Product> getAllProduct() {
        return productRepository.findAll();
    }
    @Override
    public Product updateProduct(UUID id, Product updatedProduct) {
        return productRepository.findById(id)
            .map(product -> {
                product.setName(updatedProduct.getName());
                product.setDescription(updatedProduct.getDescription());
                product.setCategory(updatedProduct.getCategory());
                product.setStockQuantity(updatedProduct.getStockQuantity());
                product.setPrice(updatedProduct.getPrice());
                product.setImageUrl(updatedProduct.getImageUrl());
                product.setAvailableQuantity(updatedProduct.getAvailableQuantity());
                product.setStatus(updatedProduct.getStatus());
                product.setLocation(updatedProduct.getLocation());
                product.setSeller(updatedProduct.getSeller());
                product.setUpdatedAt(Instant.now()); // if you have an updatedAt field
                return productRepository.save(product);
            })
            .orElseThrow(() -> new NoSuchElementException("Product not found"));
    }
    @Override
    public void deleteProduct(UUID id) {
        if(!productRepository.existsById(id)) {
            throw new NoSuchElementException("Product not found");
        }
        productRepository.deleteById(id);
    }
    @Override
    public void increaseStock(UUID productId, int quantity) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'increaseStock'");
    }
    @Override
    public void decreaseStock(UUID productId, int quantity) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'decreaseStock'");
    }
    @Override
    public List<Product> findProductsBySeller(UUID sellerId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findProductsBySeller'");
    }
}
