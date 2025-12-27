package Bazaar.com.project.feature.Product.service;

import java.util.HashMap;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import Bazaar.com.project.exception.FuncErrorException;
import Bazaar.com.project.exception.IdInvalidException;
import Bazaar.com.project.exception.InvalidArgumentException;
import Bazaar.com.project.exception.InvalidFilterValueException;
import Bazaar.com.project.exception.UserNotFoundException;
import Bazaar.com.project.feature.Product.dto.ProductMapper;
import Bazaar.com.project.feature.Product.dto.request.CreateProductRequest;
import Bazaar.com.project.feature.Product.dto.request.UpdateInventoryRequest;
import Bazaar.com.project.feature.Product.dto.request.UpdateLogisticsRequest;
import Bazaar.com.project.feature.Product.dto.request.UpdateProductRequest;
import Bazaar.com.project.feature.Product.dto.response.InventoryResponse;
import Bazaar.com.project.feature.Product.dto.response.LogisticsResponse;
import Bazaar.com.project.feature.Product.dto.response.ProductBasicResponse;
import Bazaar.com.project.feature.Product.dto.response.ProductFullResponse;
import Bazaar.com.project.feature.Product.dto.response.ProductSummaryResponse;
import Bazaar.com.project.feature.Product.dto.response.ProductViewerResponse;
import Bazaar.com.project.feature.Product.enums.ProductStatus;
import Bazaar.com.project.feature.Product.model.Product;
import Bazaar.com.project.feature.Product.model.embeddables.InventoryInfo;
import Bazaar.com.project.feature.Product.model.embeddables.LogisticsInfo;
import Bazaar.com.project.feature.Product.repository.ProductRepository;
import Bazaar.com.project.feature.User.model.User;
import Bazaar.com.project.feature.User.repository.UserRepository;
import Bazaar.com.project.feature.User.service.UserProfileService;
import Bazaar.com.project.feature._common.response.Meta;
import Bazaar.com.project.feature._common.response.ResultPaginationDTO;
import jakarta.transaction.Transactional;

/**
 * KeyForge Product service implementation.
 * 
 * Multi-step creation flow:
 * 1. createProduct() - Creates DRAFT with basic info + attributes
 * 2. updateInventory() - Adds pricing/stock
 * 3. updateLogistics() - Adds shipping info
 * 4. changeStatus(ACTIVE) - Activates product (validates inventory is set)
 */
@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserProfileService userProfileService;

    // ===== Step 1: Create DRAFT =====

    @Override
    @Transactional
    public ProductBasicResponse createProduct(CreateProductRequest req, UUID sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new UserNotFoundException("Seller not found"));

        Product p = new Product();
        p.setName(req.name());
        p.setDescription(req.description());
        p.setCategory(req.category());
        p.setProductCondition(req.productCondition());
        p.setStockStatus(req.stockStatus());
        p.setSeller(seller);
        p.setStatus(ProductStatus.DRAFT);

        // Set attributes (JSONB)
        p.setAttributes(req.attributes() != null ? req.attributes() : new HashMap<>());

        // Initialize empty inventory and logistics
        p.setInventory(new InventoryInfo());
        p.setLogistics(new LogisticsInfo());

        // TODO: Handle imageUrls - upload to cloudinary or store references

        p = productRepository.save(p);
        return ProductMapper.toBasic(p);
    }

    // ===== Step 2: Update Inventory =====

    @Override
    @Transactional
    public InventoryResponse updateInventory(UUID productId, UUID sellerId, UpdateInventoryRequest req) {
        Product p = getOwned(productId, sellerId);

        InventoryInfo inv = p.getInventory();
        if (inv == null) {
            inv = new InventoryInfo();
            p.setInventory(inv);
        }

        inv.setPrice(req.price());
        inv.setStockQuantity(req.stockQuantity());
        inv.setMinOrderQuantity(defaultIfNull(req.minOrderQuantity(), 1));
        inv.setMaxOrderQuantity(req.maxOrderQuantity());

        // Sanity check
        if (inv.getMaxOrderQuantity() != null && inv.getMinOrderQuantity() != null &&
                inv.getMaxOrderQuantity() < inv.getMinOrderQuantity()) {
            throw new InvalidArgumentException("maxOrderQuantity must be >= minOrderQuantity");
        }

        // Auto-activate if all required fields are set
        if (isReadyForActivation(p)) {
            p.setStatus(ProductStatus.ACTIVE);
        }

        productRepository.save(p);
        return ProductMapper.toInventoryResponse(inv);
    }

    // ===== Step 3: Update Logistics =====

    @Override
    @Transactional
    public LogisticsResponse updateLogistics(UUID productId, UUID sellerId, UpdateLogisticsRequest req) {
        Product p = getOwned(productId, sellerId);

        LogisticsInfo lg = p.getLogistics();
        if (lg == null) {
            lg = new LogisticsInfo();
            p.setLogistics(lg);
        }

        if (req.location() != null)
            lg.setLocation(req.location());

        if (lg.getShipping() == null) {
            lg.setShipping(new LogisticsInfo.ShippingOptions());
        }
        if (req.supportFastShipping() != null)
            lg.getShipping().setFast(req.supportFastShipping());
        if (req.supportRegularShipping() != null)
            lg.getShipping().setRegular(req.supportRegularShipping());
        if (req.supportEconomyShipping() != null)
            lg.getShipping().setEconomy(req.supportEconomyShipping());

        // Auto-activate if all required fields are set
        if (isReadyForActivation(p)) {
            p.setStatus(ProductStatus.ACTIVE);
        }

        productRepository.save(p);
        return ProductMapper.toLogisticsResponse(lg);
    }

    // ===== General Update =====

    @Override
    @Transactional
    public ProductFullResponse updateProduct(UUID productId, UUID sellerId, UpdateProductRequest req) {
        Product p = getOwned(productId, sellerId);

        // Update basic info
        p.setName(req.name());
        p.setDescription(req.description());
        p.setCategory(req.category());
        p.setStockStatus(req.stockStatus());

        // Update attributes (JSONB)
        p.setAttributes(req.attributes() != null ? req.attributes() : new HashMap<>());

        // Update inventory
        InventoryInfo inv = p.getInventory();
        if (inv == null) {
            inv = new InventoryInfo();
            p.setInventory(inv);
        }
        inv.setPrice(req.price());
        inv.setStockQuantity(req.stockQuantity());
        inv.setMinOrderQuantity(defaultIfNull(req.minOrderQuantity(), 1));
        inv.setMaxOrderQuantity(req.maxOrderQuantity());

        // Update logistics if provided
        LogisticsInfo lg = p.getLogistics();
        if (lg == null) {
            lg = new LogisticsInfo();
            p.setLogistics(lg);
        }
        if (req.location() != null)
            lg.setLocation(req.location());
        if (lg.getShipping() == null) {
            lg.setShipping(new LogisticsInfo.ShippingOptions());
        }
        if (req.supportFastShipping() != null)
            lg.getShipping().setFast(req.supportFastShipping());
        if (req.supportRegularShipping() != null)
            lg.getShipping().setRegular(req.supportRegularShipping());
        if (req.supportEconomyShipping() != null)
            lg.getShipping().setEconomy(req.supportEconomyShipping());

        p = productRepository.save(p);
        return ProductMapper.toFull(p);
    }

    // ===== Status Management =====

    @Override
    @Transactional
    public ProductBasicResponse changeStatus(UUID productId, UUID sellerId, ProductStatus status) {
        Product p = getOwned(productId, sellerId);

        // Validate before activating
        if (status == ProductStatus.ACTIVE) {
            InventoryInfo inv = p.getInventory();
            if (inv == null || inv.getPrice() == null) {
                throw new FuncErrorException(
                        "Cannot activate product: inventory/price not set. Complete Step 2 (updateInventory) first.");
            }
        }

        p.setStatus(status);
        productRepository.save(p);
        return ProductMapper.toBasic(p);
    }

    // ===== Read Operations =====

    @Override
    public ProductFullResponse findProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Product not found with ID: " + id));
        return ProductMapper.toFull(product);
    }

    @Override
    public ProductViewerResponse findProductByIdForViewer(UUID id) {
        Product product = productRepository.findByIdWithImages(id)
                .orElseThrow(() -> new NoSuchElementException("Product not found with ID: " + id));

        User user = userRepository.findById(product.getSeller().getId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        String avatarUrl = userProfileService.buildAvatarUrl(
                user.getProfilePhotoPublicId(),
                user.getProfilePhotoVersion());
        return ProductMapper.toViewer(product, user, avatarUrl);
    }

    @Override
    public ResultPaginationDTO getAllProducts(Specification<Product> specification, Pageable pageable) {
        Page<Product> pageProducts;
        try {
            pageProducts = this.productRepository.findAll(specification, pageable);
        } catch (InvalidDataAccessApiUsageException e) {
            throw new InvalidFilterValueException("Invalid filter value provided", e);
        }
        return buildPaginationResult(pageProducts, pageable);
    }

    @Override
    public ResultPaginationDTO findProductsBySeller(
            UUID sellerId,
            Specification<Product> spec,
            Pageable pageable) {

        Page<Product> pageProducts;
        try {
            Specification<Product> sellerSpec = (root, query, cb) -> cb.equal(root.get("seller").get("id"), sellerId);
            Specification<Product> combined = (spec == null) ? sellerSpec : sellerSpec.and(spec);
            pageProducts = productRepository.findAll(combined, pageable);
        } catch (InvalidDataAccessApiUsageException e) {
            throw new InvalidFilterValueException("Invalid filter value provided", e);
        }
        return buildPaginationResult(pageProducts, pageable);
    }

    // ===== Delete =====

    @Override
    public void deleteProduct(UUID id, UUID sellerId) {
        Product p = getOwned(id, sellerId);
        productRepository.delete(p);
    }

    // ===== Inventory helpers =====

    @Override
    @Transactional
    public InventoryResponse increaseStock(UUID productId, int quantity) {
        if (quantity <= 0)
            throw new FuncErrorException("Quantity must be > 0");
        var p = productRepository.findById(productId)
                .orElseThrow(() -> new IdInvalidException("Product not found"));
        var inv = p.getInventory();
        inv.setStockQuantity(inv.getStockQuantity() + quantity);
        return ProductMapper.toInventoryResponse(inv);
    }

    @Override
    @Transactional
    public InventoryResponse decreaseStock(UUID productId, int quantity) {
        if (quantity <= 0)
            throw new FuncErrorException("Quantity must be > 0");
        var p = productRepository.findById(productId)
                .orElseThrow(() -> new IdInvalidException("Product not found"));
        var inv = p.getInventory();
        int newStock = inv.getStockQuantity() - quantity;
        if (newStock < 0)
            throw new FuncErrorException("Stock cannot go negative");
        inv.setStockQuantity(newStock);
        if (inv.availableQuantity() < 0) {
            throw new FuncErrorException("Available would be negative due to existing reservations");
        }
        return ProductMapper.toInventoryResponse(inv);
    }

    // ===== Helpers =====

    @Transactional
    public Product getOwned(UUID id, UUID sellerId) {
        return productRepository.findByIdAndSellerId(id, sellerId)
                .orElseThrow(() -> new NoSuchElementException("Product not found or not owned"));
    }

    private ResultPaginationDTO buildPaginationResult(Page<Product> pageProducts, Pageable pageable) {
        ResultPaginationDTO res = new ResultPaginationDTO();
        Meta meta = new Meta();
        meta.setPage(pageable.getPageNumber());
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageProducts.getTotalPages());
        meta.setTotal(pageProducts.getTotalElements());
        res.setMeta(meta);

        List<ProductSummaryResponse> listProduct = pageProducts.getContent()
                .stream().map(ProductMapper::toSummary)
                .toList();
        res.setResult(listProduct);
        return res;
    }

    private static Integer defaultIfNull(Integer v, Integer def) {
        return v == null ? def : v;
    }

    /**
     * Checks if product has all required fields set for activation.
     * Excludes image-related fields (thumbnail) from validation.
     */
    private boolean isReadyForActivation(Product p) {
        // Basic info (already required at creation, but double-check)
        if (p.getName() == null || p.getCategory() == null ||
                p.getProductCondition() == null || p.getStockStatus() == null) {
            return false;
        }

        // Inventory validation
        InventoryInfo inv = p.getInventory();
        if (inv == null || inv.getPrice() == null || inv.getStockQuantity() == null) {
            return false;
        }

        // Logistics validation
        LogisticsInfo lg = p.getLogistics();
        if (lg == null || lg.getLocation() == null || lg.getLocation().isBlank()) {
            return false;
        }

        // At least one shipping option must be enabled
        LogisticsInfo.ShippingOptions shipping = lg.getShipping();
        if (shipping == null) {
            return false;
        }
        boolean hasShipping = Boolean.TRUE.equals(shipping.getFast()) ||
                Boolean.TRUE.equals(shipping.getRegular()) ||
                Boolean.TRUE.equals(shipping.getEconomy());
        if (!hasShipping) {
            return false;
        }
        return true;
    }
}
