package Bazaar.com.project.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Bazaar.com.project.dto.ProductDto.ProductCreateRequestDto;
import Bazaar.com.project.dto.ProductDto.ProductResponseDto;
import Bazaar.com.project.service.interfaces.ProductService;
import Bazaar.com.project.util.ApiResponse;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponseDto>> create(@Valid @RequestBody ProductCreateRequestDto productDto) {
        ProductResponseDto newProduct = this.productService.createProduct(productDto);
        ApiResponse<ProductResponseDto> response = new ApiResponse<>(
            HttpStatus.CREATED,
            "Product created successfully",
            newProduct, 
            String.valueOf(HttpStatus.CREATED.value())
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponseDto>> getProduct(@PathVariable UUID id) {
        ProductResponseDto product = productService.findProductById(id);
        ApiResponse<ProductResponseDto> response = new ApiResponse<>(
            HttpStatus.OK,
            "Product fetched successfully",
            product, 
            String.valueOf(HttpStatus.OK.value())
        );
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponseDto>>> getAllProduct() {
        List<ProductResponseDto> products = productService.getAllProduct();
        ApiResponse<List<ProductResponseDto>> response = new ApiResponse<>(
            HttpStatus.OK,
            "Products fetched successfully",
            products, 
            String.valueOf(HttpStatus.OK.value())
        );
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // TODO: need to have ProductUpdateResponseDto
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponseDto>> updateProduct(@PathVariable UUID id, @RequestBody ProductCreateRequestDto product) {
        ProductResponseDto updatedProduct = productService.updateProduct(id, product);
        ApiResponse<ProductResponseDto> response = new ApiResponse<>(
            HttpStatus.OK,
            "Product updated successfully",
            updatedProduct, 
            String.valueOf(HttpStatus.OK.value())
        );
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
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
