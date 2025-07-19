package Bazaar.com.project.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Bazaar.com.project.model.Product;
import Bazaar.com.project.service.interfaces.ProductService;
import Bazaar.com.project.util.ApiResponse;
// import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
// import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<ApiResponse<Product>> create(@Valid @RequestBody Product product) {
        Product newProduct = this.productService.createProduct(product);
        ApiResponse<Product> response = new ApiResponse<>(
            HttpStatus.CREATED,
            "Product created successfully",
            newProduct, 
            String.valueOf(HttpStatus.CREATED.value())
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProduct(@PathVariable UUID id) {
        Product product = productService.findProductById(id);
        ApiResponse<Product> response = new ApiResponse<>(
            HttpStatus.OK,
            "Product fetched successfully",
            product, 
            String.valueOf(HttpStatus.OK.value())
        );
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getAllProduct() {
        List<Product> products = productService.getAllProduct();
        ApiResponse<List<Product>> response = new ApiResponse<>(
            HttpStatus.OK,
            "Products fetched successfully",
            products, 
            String.valueOf(HttpStatus.OK.value())
        );
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(@PathVariable UUID id, @RequestBody Product product) {
        Product updatedProduct = productService.updateProduct(id, product);
        ApiResponse<Product> response = new ApiResponse<>(
            HttpStatus.OK,
            "Product updated successfully",
            updatedProduct, 
            String.valueOf(HttpStatus.OK.value())
        );
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // @ExceptionHandler(EntityNotFoundException.class) 
    // public ResponseEntity<ApiResponse<?>> handleNotFound(EntityNotFoundException ex) { 
    //     var result = new ApiResponse<>(
    //         HttpStatus.INTERNAL_SERVER_ERROR, 
    //         "handleNotFound", 
    //         null, 
    //         ex.getMessage());
        
    //     return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    // } 

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.OK,
                "Product deleted successfully",
                null,
                String.valueOf(HttpStatus.OK.value())
        );
        return ResponseEntity.ok(response);
    }
}
