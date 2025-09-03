package Bazaar.com.project.service.interfaces;

import java.util.List;
import java.util.UUID;

import Bazaar.com.project.dto.ProductDto.Request.*;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import Bazaar.com.project.dto.ResultPaginationDTO;
import Bazaar.com.project.dto.ProductDto.Response.DetailedResponse;
import Bazaar.com.project.dto.ProductDto.Response.InventoryResponse;
import Bazaar.com.project.dto.ProductDto.Response.LogisticsResponse;
import Bazaar.com.project.dto.ProductDto.Response.ProductBasicResponse;
import Bazaar.com.project.dto.ProductDto.Response.ProductFullResponse;
import Bazaar.com.project.model.Product.Product;
import Bazaar.com.project.model.Product.ProductEnum.ProductStatus;

public interface ProductService {
    // ProductResponseDto createProduct(CreateProductRequest product);
    ProductBasicResponse createBasic(CreateProductRequest req);

    DetailedResponse updateDetails(UUID productId, UUID sellerId, UpdateDetailsRequest req);

    ProductBasicResponse updateBasic(UpdateBasicRequest req, UUID productId, UUID sellerId);

    InventoryResponse updateInventory(UUID productId, UUID sellerId, UpdateInventoryRequest req);

    LogisticsResponse updateLogistics(UUID productId, UUID sellerId, UpdateLogisticsRequest req);

    ProductFullResponse findProductById(UUID id);

    ResultPaginationDTO getAllProduct(Specification<Product> specification, Pageable pageable);

    ResultPaginationDTO findProductsBySeller(UUID sellerId, Specification<Product> spec, Pageable pageable);

    void deleteProduct(UUID id);

    InventoryResponse increaseStock(UUID productId, int quantity);

    InventoryResponse decreaseStock(UUID productId, int quantity);

    ProductBasicResponse changeStatus(UUID id, ProductStatus status);
}
