package Bazaar.com.project.feature.Product;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.turkraft.springfilter.boot.Filter;

import Bazaar.com.project.feature.Product.dto.request.CreateProductRequest;
import Bazaar.com.project.feature.Product.dto.request.UpdateBasicRequest;
import Bazaar.com.project.feature.Product.dto.request.UpdateDetailsRequest;
import Bazaar.com.project.feature.Product.dto.request.UpdateInventoryRequest;
import Bazaar.com.project.feature.Product.dto.request.UpdateLogisticsRequest;
import Bazaar.com.project.feature.Product.dto.response.DetailedResponse;
import Bazaar.com.project.feature.Product.dto.response.InventoryResponse;
import Bazaar.com.project.feature.Product.dto.response.LogisticsResponse;
import Bazaar.com.project.feature.Product.dto.response.ProductBasicResponse;
import Bazaar.com.project.feature.Product.dto.response.ProductFullResponse;
import Bazaar.com.project.feature.Product.dto.response.ProductViewerResponse;
import Bazaar.com.project.feature.Product.model.Product;
import Bazaar.com.project.feature.Product.service.ProductService;
import Bazaar.com.project.feature._common.annotation.ApiMessage;
import Bazaar.com.project.feature._common.response.ResultPaginationDTO;
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

    // Create Basic info (Step 1)
    @PostMapping
    @ApiMessage("Product created successfully")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ProductBasicResponse> create(@Valid @RequestBody CreateProductRequest productDto) {
        ProductBasicResponse response = this.productService.createBasic(productDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Create Basic info (Step 1)
    @PutMapping("{id}/basic")
    @ApiMessage("Product basic updated successfully")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ProductBasicResponse> updateBasic(
            @Valid @RequestBody UpdateBasicRequest productDto,
            @PathVariable UUID id,
            @RequestParam UUID sellerId) {
        ProductBasicResponse response = this.productService.updateBasic(productDto, id, sellerId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /*
     * Update sections (Step 2–4)
     */
    @PutMapping("/{id}/details")
    @ApiMessage("Product details updated successfully")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<DetailedResponse> updateDetails(
            @PathVariable UUID id,
            @RequestParam UUID sellerId, // in real app, take from auth context
            @Valid @RequestBody UpdateDetailsRequest req) {
        DetailedResponse response = productService.updateDetails(id, sellerId, req);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/{id}/inventory")
    @ApiMessage("Product inventory updated successfully")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<InventoryResponse> updateInventory(
            @PathVariable UUID id,
            @RequestParam UUID sellerId,
            @Valid @RequestBody UpdateInventoryRequest req) {
        InventoryResponse response = productService.updateInventory(id, sellerId, req);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/{id}/logistics")
    @ApiMessage("Product logistic updated successfully")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<LogisticsResponse> updateLogistics(
            @PathVariable UUID id,
            @RequestParam UUID sellerId,
            @Valid @RequestBody UpdateLogisticsRequest req) {
        LogisticsResponse response = productService.updateLogistics(id, sellerId, req);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    /* Read (edit + detail) */
    @GetMapping("/{id}/seller")
    @ApiMessage("Product fetched successfully")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public ResponseEntity<ProductFullResponse> getProductForSeller(@PathVariable UUID id) {
        ProductFullResponse product = productService.findProductById(id);
        return ResponseEntity.status(HttpStatus.OK).body(product);
    }

    @GetMapping("/{id}")
    @ApiMessage("Product fetched successfully")
    public ResponseEntity<ProductViewerResponse> getProduct(@PathVariable UUID id) {
        ProductViewerResponse product = productService.findProductByIdForViewer(id);
        return ResponseEntity.status(HttpStatus.OK).body(product);
    }

    @GetMapping
    @ApiMessage("Products fetched successfully")
    public ResponseEntity<ResultPaginationDTO> getAllProduct(
            @Filter Specification<Product> spec,
            Pageable pageable) {
        ResultPaginationDTO result = productService.getAllProduct(spec, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @GetMapping("/by-seller/{sellerId}")
    @ApiMessage("Products by seller fetched successfully")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public ResponseEntity<ResultPaginationDTO> getProductsBySeller(
            @PathVariable UUID sellerId,
            @Filter Specification<Product> spec,
            Pageable pageable) {
        ResultPaginationDTO result = productService.findProductsBySeller(sellerId, spec, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Products deleted successfully")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().body(null);
    }
}