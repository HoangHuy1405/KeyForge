package Bazaar.com.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Bazaar.com.project.model.Product;
import Bazaar.com.project.repository.ProductRepository;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public Product handleCreateProduct(Product product) {
        return this.productRepository.save(product);
    }
}
