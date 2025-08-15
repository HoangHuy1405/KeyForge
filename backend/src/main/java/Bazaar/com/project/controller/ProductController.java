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
import Bazaar.com.project.util.Annotation.ApiMessage;
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
    @ApiMessage("Product created successfully")
    public ResponseEntity<ProductResponseDto> create(@Valid @RequestBody ProductCreateRequestDto productDto) {
        ProductResponseDto newProduct = this.productService.createProduct(productDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newProduct);
    }
    @GetMapping("/{id}")
    @ApiMessage("Product fetched successfully")
    public ResponseEntity<ProductResponseDto> getProduct(@PathVariable UUID id) {
        ProductResponseDto product = productService.findProductById(id);
        return ResponseEntity.status(HttpStatus.OK).body(product);
    }
    @GetMapping
    @ApiMessage("Products fetched successfully")
    public ResponseEntity<List<ProductResponseDto>> getAllProduct() {
        List<ProductResponseDto> products = productService.getAllProduct();
        return ResponseEntity.status(HttpStatus.OK).body(products);
    }
    // TODO: need to have ProductUpdateResponseDto
    @PutMapping("/{id}")
    @ApiMessage("Products updated successfully")
    public ResponseEntity<ProductResponseDto> updateProduct(@PathVariable UUID id, @RequestBody ProductCreateRequestDto product) {
        ProductResponseDto updatedProduct = productService.updateProduct(id, product);
        return ResponseEntity.status(HttpStatus.OK).body(updatedProduct);
    }
    @DeleteMapping("/{id}")
    @ApiMessage("Products deleted successfully")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().body(null);
    }
}
