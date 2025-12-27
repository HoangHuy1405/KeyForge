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

import Bazaar.com.project.exception.UserNotFoundException;
import Bazaar.com.project.feature.Product.dto.request.CreateProductRequest;
import Bazaar.com.project.feature.Product.dto.request.UpdateInventoryRequest;
import Bazaar.com.project.feature.Product.dto.request.UpdateLogisticsRequest;
import Bazaar.com.project.feature.Product.dto.request.UpdateProductRequest;
import Bazaar.com.project.feature.Product.dto.response.InventoryResponse;
import Bazaar.com.project.feature.Product.dto.response.LogisticsResponse;
import Bazaar.com.project.feature.Product.dto.response.ProductBasicResponse;
import Bazaar.com.project.feature.Product.dto.response.ProductFullResponse;
import Bazaar.com.project.feature.Product.dto.response.ProductViewerResponse;
import Bazaar.com.project.feature.Product.enums.ProductStatus;
import Bazaar.com.project.feature.Product.model.Product;
import Bazaar.com.project.feature.Product.service.ProductService;
import Bazaar.com.project.feature._common.annotation.ApiMessage;
import Bazaar.com.project.feature._common.response.ResultPaginationDTO;
import Bazaar.com.project.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * KeyForge Product REST Controller.
 * 
 * Multi-step creation flow:
 * 1. POST /api/products - Create DRAFT
 * 2. PUT /api/products/{id}/inventory - Add pricing/stock
 * 3. PUT /products/{id}/logistics - Add shipping info
 * 4. PUT /products/{id}/status?status=ACTIVE - Activate
 */
@RestController
@RequestMapping("/products")
@Tag(name = "Products", description = "Multi-step product creation for keyboard kits, switches, keycaps, etc.")
public class ProductController {
    @Autowired
    private ProductService productService;

    // ===== Step 1: Create DRAFT =====
    @Operation(summary = "Create a new product (Step 1)")
    @PostMapping
    @ApiMessage("Product created successfully")
    @PreAuthorize("hasAnyAuthority('SELLER', 'ADMIN')")
    public ResponseEntity<ProductBasicResponse> createProduct(
            @Valid @RequestBody CreateProductRequest request) {
        UUID sellerId = SecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new UserNotFoundException("Not authenticated"));
        ProductBasicResponse response = productService.createProduct(request, sellerId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ===== Step 2: Update Inventory =====
    @Operation(summary = "Update product inventory (Step 2)", description = "Adds pricing and stock information to a product. Required before activating.")
    @PutMapping("/{id}/inventory")
    @ApiMessage("Product inventory updated successfully")
    @PreAuthorize("hasAnyAuthority('SELLER', 'ADMIN')")
    public ResponseEntity<InventoryResponse> updateInventory(
            @Parameter(description = "Product ID") @PathVariable UUID id,
            @Valid @RequestBody UpdateInventoryRequest request) {
        UUID sellerId = SecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new UserNotFoundException("Not authenticated"));
        InventoryResponse response = productService.updateInventory(id, sellerId, request);
        return ResponseEntity.ok(response);
    }

    // ===== Step 3: Update Logistics =====
    @Operation(summary = "Update product logistics (Step 3)", description = "Adds location and shipping options to a product.")
    @PutMapping("/{id}/logistics")
    @ApiMessage("Product logistics updated successfully")
    @PreAuthorize("hasAnyAuthority('SELLER', 'ADMIN')")
    public ResponseEntity<LogisticsResponse> updateLogistics(
            @Parameter(description = "Product ID") @PathVariable UUID id,
            @Valid @RequestBody UpdateLogisticsRequest request) {
        UUID sellerId = SecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new UserNotFoundException("Not authenticated"));
        LogisticsResponse response = productService.updateLogistics(id, sellerId, request);
        return ResponseEntity.ok(response);
    }

    // ===== General Update =====
    @Operation(summary = "Update all product fields", description = "Updates all product fields at once. Can be used after initial creation steps.")
    @PutMapping("/{id}")
    @ApiMessage("Product updated successfully")
    @PreAuthorize("hasAnyAuthority('SELLER', 'ADMIN')")
    public ResponseEntity<ProductFullResponse> updateProduct(
            @Parameter(description = "Product ID") @PathVariable UUID id,
            @Valid @RequestBody UpdateProductRequest request) {
        UUID sellerId = SecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new UserNotFoundException("Not authenticated"));
        ProductFullResponse response = productService.updateProduct(id, sellerId, request);
        return ResponseEntity.ok(response);
    }

    // ===== Status Management =====
    @Operation(summary = "Change product status", description = "Updates product status. To activate (ACTIVE), inventory must be set first.")
    @PutMapping("/{id}/status")
    @ApiMessage("Product status changed successfully")
    @PreAuthorize("hasAnyAuthority('SELLER', 'ADMIN')")
    public ResponseEntity<ProductBasicResponse> changeStatus(
            @Parameter(description = "Product ID") @PathVariable UUID id,
            @Parameter(description = "New status (DRAFT, ACTIVE, INACTIVE)") @RequestParam ProductStatus status) {
        UUID sellerId = SecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new UserNotFoundException("Not authenticated"));
        ProductBasicResponse response = productService.changeStatus(id, sellerId, status);
        return ResponseEntity.ok(response);
    }

    // ===== Read Operations =====
    @Operation(summary = "List products by seller", description = "Returns paginated list of products owned by a specific seller.")
    @GetMapping("/by-seller")
    @ApiMessage("Products by seller fetched successfully")
    @PreAuthorize("hasAnyAuthority('SELLER','ADMIN')")
    public ResponseEntity<ResultPaginationDTO> getProductsBySeller(
            @Parameter(hidden = true) @Filter Specification<Product> spec,
            Pageable pageable) {
        UUID sellerId = SecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new UserNotFoundException("Not authenticated"));
        ResultPaginationDTO result = productService.findProductsBySeller(sellerId, spec, pageable);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Get product for seller", description = "Returns full product details for seller's management view.")
    @GetMapping("/{id}/seller")
    @ApiMessage("Product fetched successfully")
    @PreAuthorize("hasAnyAuthority('SELLER','ADMIN')")
    public ResponseEntity<ProductFullResponse> getProductForSeller(
            @Parameter(description = "Product ID") @PathVariable UUID id) {
        ProductFullResponse product = productService.findProductById(id);
        return ResponseEntity.ok(product);
    }

    // ===== Delete =====
    @Operation(summary = "Delete a product", description = "Permanently deletes a product. This action cannot be undone.")
    @DeleteMapping("/{id}")
    @ApiMessage("Product deleted successfully")
    @PreAuthorize("hasAnyAuthority('SELLER','ADMIN')")
    public ResponseEntity<Void> deleteProduct(
            @Parameter(description = "Product ID") @PathVariable UUID id) {
        UUID sellerId = SecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new UserNotFoundException("Not authenticated"));
        productService.deleteProduct(id, sellerId);
        return ResponseEntity.noContent().build();
    }

    // * PUBLIC APIs */
    @Operation(summary = "List all products", description = "Returns paginated list of products with optional filtering.")
    @GetMapping
    @ApiMessage("Products fetched successfully")
    public ResponseEntity<ResultPaginationDTO> getAllProducts(
            @Parameter(hidden = true) @Filter Specification<Product> spec,
            @Parameter(description = "Pagination parameters") Pageable pageable) {
        // Only show ACTIVE products to public
        Specification<Product> activeSpec = (root, query, cb) -> cb.equal(root.get("status"), ProductStatus.ACTIVE);
        Specification<Product> combined = (spec == null) ? activeSpec : activeSpec.and(spec);

        ResultPaginationDTO result = productService.getAllProducts(combined, pageable);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Get product details", description = "Returns product details for customer-facing product page.")
    @GetMapping("/{id}")
    @ApiMessage("Product fetched successfully")
    public ResponseEntity<ProductViewerResponse> getProduct(
            @Parameter(description = "Product ID") @PathVariable UUID id) {
        ProductViewerResponse product = productService.findProductByIdForViewer(id);
        return ResponseEntity.ok(product);
    }
}