package Bazaar.com.project.feature.Product.service;

import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

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
import Bazaar.com.project.feature.Product.enums.ProductStatus;
import Bazaar.com.project.feature.Product.model.Product;
import Bazaar.com.project.feature._common.response.ResultPaginationDTO;

public interface ProductService {
    // ProductResponseDto createProduct(CreateProductRequest product);
    ProductBasicResponse createBasic(CreateProductRequest req);

    DetailedResponse updateDetails(UUID productId, UUID sellerId, UpdateDetailsRequest req);

    ProductBasicResponse updateBasic(UpdateBasicRequest req, UUID productId, UUID sellerId);

    InventoryResponse updateInventory(UUID productId, UUID sellerId, UpdateInventoryRequest req);

    LogisticsResponse updateLogistics(UUID productId, UUID sellerId, UpdateLogisticsRequest req);

    ProductFullResponse findProductById(UUID id);

    ProductViewerResponse findProductByIdForViewer(UUID id);

    ResultPaginationDTO getAllProduct(Specification<Product> specification, Pageable pageable);

    ResultPaginationDTO findProductsBySeller(UUID sellerId, Specification<Product> spec, Pageable pageable);

    void deleteProduct(UUID id);

    InventoryResponse increaseStock(UUID productId, int quantity);

    InventoryResponse decreaseStock(UUID productId, int quantity);

    ProductBasicResponse changeStatus(UUID id, ProductStatus status);
}
