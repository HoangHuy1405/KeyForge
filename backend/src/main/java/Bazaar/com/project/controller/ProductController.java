package Bazaar.com.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Bazaar.com.project.model.Product;
import Bazaar.com.project.service.ProductService;
import Bazaar.com.project.util.ApiResponse;

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
}
