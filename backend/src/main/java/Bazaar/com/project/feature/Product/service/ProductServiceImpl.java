package Bazaar.com.project.feature.Product.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import Bazaar.com.project.exception.FuncErrorException;
import Bazaar.com.project.exception.IdInvalidException;
import Bazaar.com.project.exception.InvalidFilterValueException;
import Bazaar.com.project.exception.UserNotFoundException;
import Bazaar.com.project.feature.Product.dto.ProductMapper;
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
import Bazaar.com.project.feature.Product.dto.response.ProductSummaryResponse;
import Bazaar.com.project.feature.Product.dto.response.ProductViewerResponse;
import Bazaar.com.project.feature.Product.dto.response.ShippingOptionsResponse;
import Bazaar.com.project.feature.Product.enums.ProductStatus;
import Bazaar.com.project.feature.Product.model.Product;
import Bazaar.com.project.feature.Product.model.embeddables.InventoryInfo;
import Bazaar.com.project.feature.Product.model.embeddables.LogisticsInfo;
import Bazaar.com.project.feature.Product.model.embeddables.ProductDetails;
import Bazaar.com.project.feature.Product.repository.ProductRepository;
import Bazaar.com.project.feature.User.model.User;
import Bazaar.com.project.feature.User.repository.UserRepository;
import Bazaar.com.project.feature.User.service.UserProfileService;
import Bazaar.com.project.feature._common.response.Meta;
import Bazaar.com.project.feature._common.response.ResultPaginationDTO;
import jakarta.transaction.Transactional;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserProfileService userProfileService;

    @Override
    @Transactional
    public ProductBasicResponse createBasic(CreateProductRequest req) {
        User seller = userRepository.findById(req.sellerId())
                .orElseThrow(() -> new UserNotFoundException("Seller not found"));

        Product p = new Product();
        p.setName(req.name());
        p.setDescription(req.description());
        p.setCategory(req.category());
        p.setSeller(seller);
        p.setStatus(ProductStatus.DRAFT);

        // init embeddables
        if (p.getDetails() == null)
            p.setDetails(new ProductDetails());
        if (p.getInventory() == null)
            p.setInventory(new InventoryInfo());
        if (p.getLogistics() == null)
            p.setLogistics(new LogisticsInfo());

        p = productRepository.save(p);
        return ProductMapper.toBasic(p);
    }

    @Override
    @Transactional
    public DetailedResponse updateDetails(UUID productId, UUID sellerId, UpdateDetailsRequest req) {
        Product p = getOwned(productId, sellerId);
        ProductDetails d = p.getDetails();
        d.setBrand(req.brand());
        d.setModel(req.model());
        d.setSize(req.size());
        d.setMaterial(req.material());
        d.setOrigin(req.origin());
        d.setCondition(req.condition());
        return new DetailedResponse(
                d.getBrand(), d.getModel(), d.getSize(),
                d.getMaterial(), d.getOrigin(), d.getCondition());
    }

    @Override
    public ProductBasicResponse updateBasic(UpdateBasicRequest req, UUID productId, UUID sellerId) {
        Product p = getOwned(productId, sellerId);

        p.setName(req.name());
        p.setDescription(req.description());
        p.setCategory(req.category());

        p = productRepository.save(p);
        return ProductMapper.toBasic(p);
    }

    @Override
    @Transactional
    public InventoryResponse updateInventory(UUID productId, UUID sellerId, UpdateInventoryRequest req) {
        Product p = getOwned(productId, sellerId);
        InventoryInfo inv = p.getInventory();
        inv.setPrice(req.price());
        inv.setStockQuantity(req.stockQuantity());
        inv.setReservedQuantity(req.reservedQuantity());
        inv.setMinOrderQuantity(defaultIfNull(req.minOrderQuantity(), 1));
        inv.setMaxOrderQuantity(req.maxOrderQuantity());

        // sanity
        if (inv.getMaxOrderQuantity() != null && inv.getMinOrderQuantity() != null &&
                inv.getMaxOrderQuantity() < inv.getMinOrderQuantity()) {
            throw new IllegalArgumentException("maxOrderQuantity must be >= minOrderQuantity");
        }
        return new InventoryResponse(
                inv.getPrice(),
                inv.getStockQuantity(),
                inv.getReservedQuantity(),
                inv.availableQuantity(),
                inv.getMinOrderQuantity(),
                inv.getMaxOrderQuantity());
    }

    @Override
    @Transactional
    public LogisticsResponse updateLogistics(UUID productId, UUID sellerId, UpdateLogisticsRequest req) {
        var p = getOwned(productId, sellerId);
        var lg = p.getLogistics();

        lg.setWeightGrams(req.weightGrams());
        if (lg.getDimensions() == null)
            lg.setDimensions(new LogisticsInfo.Dimensions());
        lg.getDimensions().setLengthCm(req.lengthCm());
        lg.getDimensions().setWidthCm(req.widthCm());
        lg.getDimensions().setHeightCm(req.heightCm());

        lg.setLocation(req.location());
        lg.setPreOrder(Boolean.TRUE.equals(req.preOrder()));
        lg.setPreOrderLeadTimeDays(req.preOrderLeadTimeDays());

        if (lg.getShipping() == null)
            lg.setShipping(new LogisticsInfo.ShippingOptions());
        lg.getShipping().setFast(Boolean.TRUE.equals(req.supportFastShipping()));
        lg.getShipping().setRegular(Boolean.TRUE.equals(req.supportRegularShipping()));
        lg.getShipping().setEconomy(Boolean.TRUE.equals(req.supportEconomyShipping()));

        var dim = lg.getDimensions();
        var ship = lg.getShipping();
        return new LogisticsResponse(
                lg.getWeightGrams(),
                dim != null ? dim.getLengthCm() : null,
                dim != null ? dim.getWidthCm() : null,
                dim != null ? dim.getHeightCm() : null,
                lg.getLocation(),
                lg.getPreOrder(),
                lg.getPreOrderLeadTimeDays(),
                new ShippingOptionsResponse(
                        ship != null ? ship.getFast() : null,
                        ship != null ? ship.getRegular() : null,
                        ship != null ? ship.getEconomy() : null));
    }

    @Override
    public ProductFullResponse findProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Product not found with ID: " + id));
        return ProductMapper.toResponse(product);
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
    public ResultPaginationDTO getAllProduct(Specification<Product> specification, Pageable pageable) {
        Page<Product> pageProducts;
        try {
            pageProducts = this.productRepository.findAll(specification, pageable);
        } catch (InvalidDataAccessApiUsageException e) {
            // translate low-level exception into your own domain exception
            throw new InvalidFilterValueException("Invalid filter value provided", e);
        }
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

    @Override
    public ResultPaginationDTO findProductsBySeller(
            UUID sellerId,
            Specification<Product> spec,
            Pageable pageable) {

        Page<Product> pageProducts;
        try {
            Specification<Product> sellerSpec = (root, query, cb) -> cb.equal(root.get("seller").get("id"), sellerId);
            // If it's a relation: cb.equal(root.get("seller").get("id"), sellerId);
            // Combine provided spec (may be null) with seller filter
            Specification<Product> combined = (spec == null) ? sellerSpec : sellerSpec.and(spec);
            pageProducts = productRepository.findAll(combined, pageable);
        } catch (InvalidDataAccessApiUsageException e) {
            throw new InvalidFilterValueException("Invalid filter value provided", e);
        }

        ResultPaginationDTO res = new ResultPaginationDTO();
        Meta meta = new Meta();

        meta.setPage(pageable.getPageNumber());
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageProducts.getTotalPages());
        meta.setTotal(pageProducts.getTotalElements());
        res.setMeta(meta);

        // Map to summaries
        List<ProductSummaryResponse> listProduct = pageProducts.getContent()
                .stream().map(ProductMapper::toSummary)
                .toList();

        res.setResult(listProduct);
        return res;

    }

    @Override
    public void deleteProduct(UUID id) {
        if (!productRepository.existsById(id)) {
            throw new NoSuchElementException("Product not found");
        }
        productRepository.deleteById(id);
    }

    // ==== Helper API ===============
    @Override
    @Transactional
    public InventoryResponse increaseStock(UUID productId, int quantity) {
        if (quantity <= 0)
            throw new FuncErrorException("Quantity must be > 0");
        var p = productRepository.findById(productId)
                .orElseThrow(() -> new IdInvalidException("Product not found"));
        var inv = p.getInventory();
        inv.setStockQuantity(inv.getStockQuantity() + quantity);
        return new InventoryResponse(
                inv.getPrice(),
                inv.getStockQuantity(), inv.getReservedQuantity(),
                inv.availableQuantity(), inv.getMinOrderQuantity(), inv.getMaxOrderQuantity());
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
        return new InventoryResponse(
                inv.getPrice(),
                inv.getStockQuantity(), inv.getReservedQuantity(),
                inv.availableQuantity(), inv.getMinOrderQuantity(), inv.getMaxOrderQuantity());
    }

    @Override
    public ProductBasicResponse changeStatus(UUID id, ProductStatus status) {
        var p = productRepository.findById(id)
                .orElseThrow(() -> new IdInvalidException("Product not found"));
        p.setStatus(status);
        return ProductMapper.toBasic(p);
    }

    // ===== Helper =================
    @Transactional
    public Product getOwned(UUID id, UUID sellerId) {
        return productRepository.findByIdAndSellerId(id, sellerId)
                .orElseThrow(() -> new NoSuchElementException("Product not found or not owned"));
    }

    private static Integer defaultIfNull(Integer v, Integer def) {
        return v == null ? def : v;
    }
}
