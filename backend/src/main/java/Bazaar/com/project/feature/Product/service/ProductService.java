package Bazaar.com.project.feature.Product.service;

import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

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
import Bazaar.com.project.feature._common.response.ResultPaginationDTO;

/**
 * KeyForge Product service interface.
 * 
 * Product creation flow:
 * 1. createProduct() - Creates DRAFT with basic info + attributes
 * 2. updateInventory() - Adds pricing and stock info
 * 3. updateLogistics() - Adds shipping info, can activate product
 */
public interface ProductService {

    // ===== Step 1: Create DRAFT =====

    /**
     * Create a new product in DRAFT status.
     * SellerId extracted from security context.
     */
    ProductBasicResponse createProduct(CreateProductRequest req, UUID sellerId);

    // ===== Step 2: Update Inventory =====

    /**
     * Update product inventory (price, stock).
     */
    InventoryResponse updateInventory(UUID productId, UUID sellerId, UpdateInventoryRequest req);

    // ===== Step 3: Update Logistics =====

    /**
     * Update product logistics (location, shipping options).
     */
    LogisticsResponse updateLogistics(UUID productId, UUID sellerId, UpdateLogisticsRequest req);

    // ===== General Update =====

    /**
     * Update all product fields.
     */
    ProductFullResponse updateProduct(UUID productId, UUID sellerId, UpdateProductRequest req);

    // ===== Status Management =====

    /**
     * Change product status (DRAFT, ACTIVE, INACTIVE).
     * Validates that inventory is set before allowing ACTIVE status.
     */
    ProductBasicResponse changeStatus(UUID productId, UUID sellerId, ProductStatus status);

    // ===== Read Operations =====

    ProductFullResponse findProductById(UUID id);

    ProductViewerResponse findProductByIdForViewer(UUID id);

    ResultPaginationDTO getAllProducts(Specification<Product> specification, Pageable pageable);

    ResultPaginationDTO findProductsBySeller(UUID sellerId, Specification<Product> spec, Pageable pageable);

    // ===== Delete =====

    void deleteProduct(UUID id, UUID sellerId);

    // ===== Inventory helpers =====

    InventoryResponse increaseStock(UUID productId, int quantity);

    InventoryResponse decreaseStock(UUID productId, int quantity);
}
