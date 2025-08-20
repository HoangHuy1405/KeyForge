package Bazaar.com.project.service.interfaces;

import java.util.List;
import java.util.UUID;

import Bazaar.com.project.dto.ProductDto.Request.CreateProductRequest;
import Bazaar.com.project.dto.ProductDto.Request.UpdateDetailsRequest;
import Bazaar.com.project.dto.ProductDto.Request.UpdateInventoryRequest;
import Bazaar.com.project.dto.ProductDto.Request.UpdateLogisticsRequest;
import Bazaar.com.project.dto.ProductDto.Response.DetailedResponse;
import Bazaar.com.project.dto.ProductDto.Response.InventoryResponse;
import Bazaar.com.project.dto.ProductDto.Response.LogisticsResponse;
import Bazaar.com.project.dto.ProductDto.Response.ProductBasicResponse;
import Bazaar.com.project.dto.ProductDto.Response.ProductFullResponse;
import Bazaar.com.project.dto.ProductDto.Response.ProductSummaryResponse;
import Bazaar.com.project.model.Product.ProductEnum.ProductStatus;

public interface ProductService {
    // ProductResponseDto createProduct(CreateProductRequest product);
    ProductBasicResponse createBasic(CreateProductRequest req);

    DetailedResponse updateDetails(UUID productId, UUID sellerId, UpdateDetailsRequest req);

    InventoryResponse updateInventory(UUID productId, UUID sellerId, UpdateInventoryRequest req);

    LogisticsResponse updateLogistics(UUID productId, UUID sellerId, UpdateLogisticsRequest req);

    ProductFullResponse findProductById(UUID id);

    List<ProductSummaryResponse> getAllProduct();

    List<ProductSummaryResponse> findProductsBySeller(UUID sellerId);

    void deleteProduct(UUID id);

    InventoryResponse increaseStock(UUID productId, int quantity);

    InventoryResponse decreaseStock(UUID productId, int quantity);

    ProductBasicResponse changeStatus(UUID id, ProductStatus status);
}
