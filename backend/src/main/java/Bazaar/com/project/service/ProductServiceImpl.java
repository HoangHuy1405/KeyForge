package Bazaar.com.project.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Bazaar.com.project.dto.ProductDto.ProductCreateRequestDto;
import Bazaar.com.project.dto.ProductDto.ProductMapper;
import Bazaar.com.project.dto.ProductDto.ProductResponseDto;
import Bazaar.com.project.model.Product;
import Bazaar.com.project.model.ProductStatus;
import Bazaar.com.project.model.UserAggregate.User;
import Bazaar.com.project.repository.ProductRepository;
import Bazaar.com.project.repository.UserRepository;
import Bazaar.com.project.service.interfaces.ProductService;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public ProductResponseDto createProduct(ProductCreateRequestDto productDto) {
        User seller = userRepository.findById(productDto.getSellerId())
            .orElseThrow(() -> new NoSuchElementException("Seller not found with ID: " + productDto.getSellerId()));
        Product product = ProductMapper.toEntity(productDto, seller);
        this.productRepository.save(product);
        return ProductMapper.toResponse(product);
    }
    @Override
    public ProductResponseDto findProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Product not found with ID: " + id));
        return ProductMapper.toResponse(product);
    }
    @Override
    public List<ProductResponseDto> getAllProduct() {
        List<Product> products = productRepository.findAll();
        List<ProductResponseDto> responseList = new ArrayList<>();
        for(Product product : products) {
            responseList.add(ProductMapper.toResponse(product));
        }
        return responseList;
    }
    @Override
    public ProductResponseDto updateProduct(UUID id, ProductCreateRequestDto productDto) {
        Product updatedProduct = productRepository.findById(id)
            .map(product -> {
                product.setName(productDto.getName());
                product.setDescription(productDto.getDescription());
                product.setCategory(productDto.getCategory());
                product.setStockQuantity(productDto.getStockQuantity());
                product.setPrice(productDto.getPrice());
                product.setImageUrl(productDto.getImageUrl());
                product.setLocation(productDto.getLocation());
                product.setUpdatedAt(Instant.now()); // if you have an updatedAt field
                return productRepository.save(product);
            })
            .orElseThrow(() -> new NoSuchElementException("Product not found"));
        
        return ProductMapper.toResponse(updatedProduct);
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
    public List<ProductResponseDto> findProductsBySeller(UUID sellerId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findProductsBySeller'");
    }
    @Override
    public void changeStatus(UUID id, ProductStatus status) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'decreaseStock'");
    }
}
