package Bazaar.com.project.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Bazaar.com.project.model.Product;
import Bazaar.com.project.service.ProductService;
import Bazaar.com.project.util.ApiResponse;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<ApiResponse<Product>> create(@RequestBody Product product) {
        Product newProduct = this.productService.handleCreateProduct(product);
        ApiResponse<Product> response = ApiResponse.success(newProduct, "Product created successfully");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProduct(@PathVariable UUID id) {
        Product product = productService.findById(id);
        ApiResponse<Product> response = ApiResponse.success(product, "Product fetched successfully");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getAllProduct() {
        List<Product> products = productService.getAllProduct();
        ApiResponse<List<Product>> response = ApiResponse.success(products, "Products fetched successfully");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
