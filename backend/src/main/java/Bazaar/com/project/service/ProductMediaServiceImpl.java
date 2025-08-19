package Bazaar.com.project.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import Bazaar.com.project.dto.CloudinaryResDto;
import Bazaar.com.project.dto.ProductDto.ProductImageDto;
import Bazaar.com.project.dto.ProductDto.ProductMediaResponse;
import Bazaar.com.project.exception.CloudinaryException;
import Bazaar.com.project.exception.FuncErrorException;
import Bazaar.com.project.exception.IdInvalidException;
import Bazaar.com.project.model.Product.Product;
import Bazaar.com.project.model.Product.ProductImage;
import Bazaar.com.project.repository.ProductImageRepository;
import Bazaar.com.project.repository.ProductRepository;
import Bazaar.com.project.service.interfaces.CloudinaryService;
import Bazaar.com.project.service.interfaces.ProductMediaService;
import Bazaar.com.project.util.FileUploadUtil;
import jakarta.transaction.Transactional;

@Service
public class ProductMediaServiceImpl implements ProductMediaService {
        private final ProductRepository productRepository;
        private final ProductImageRepository productImageRepository;
        private final CloudinaryService cloudinaryService;

        public ProductMediaServiceImpl(ProductRepository productRepository,
                        ProductImageRepository productImageRepository,
                        CloudinaryService cloudinaryService) {
                this.productRepository = productRepository;
                this.productImageRepository = productImageRepository;
                this.cloudinaryService = cloudinaryService;
        }

        @Override
        @Transactional
        public ProductMediaResponse uploadThumbnail(UUID productId, MultipartFile file) {
                final Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new IdInvalidException("Product not found"));

                // Validate
                FileUploadUtil.assertAllowed(file, FileUploadUtil.IMAGE_PATTERN);

                // deterministic name so re-uploads overwrite
                final String fileName = "thumbnail";

                final CloudinaryResDto res = cloudinaryService
                                .uploadFile(file, fileName, "products", productId.toString(), "thumbnail");

                product.setThumbnailUrl(res.getUrl());
                product.setThumbnailPublicId(res.getPublicId());
                product.setThumbnailVersion(res.getVersion());
                productRepository.save(product);

                return toMediaResponse(product);
        }

        @Override
        @Transactional
        public ProductMediaResponse uploadGallery(UUID productId, List<MultipartFile> files) {
                if (files == null || files.isEmpty()) {
                        throw new FuncErrorException("No files provided");
                }
                final Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new IdInvalidException("Product not found"));

                // Basic sequential sort order (append at the end)
                int baseOrder = product.getImages() == null ? 0 : product.getImages().size();

                final List<ProductImage> newImages = new ArrayList<>();
                int i = 0;
                for (MultipartFile f : files) {
                        // Validate
                        FileUploadUtil.assertAllowed(f, FileUploadUtil.IMAGE_PATTERN);

                        // deterministic fileName
                        final String fileName = "img-" + (baseOrder + (++i));

                        final CloudinaryResDto res = cloudinaryService
                                        .uploadFile(f, fileName, "products", productId.toString(), "gallery");

                        final ProductImage img = ProductImage.builder()
                                        .product(product)
                                        .url(res.getUrl())
                                        .publicId(res.getPublicId())
                                        .version(res.getVersion())
                                        .sortOrder(baseOrder + i)
                                        .build();

                        newImages.add(img);
                }

                productImageRepository.saveAll(newImages);
                product.getImages().addAll(newImages);

                return toMediaResponse(product);
        }

        @Override
        @Transactional
        public ProductMediaResponse updateThumbnail(UUID productId, MultipartFile file) {
                final Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new IdInvalidException("Product not found"));

                // validate
                FileUploadUtil.assertAllowed(file, FileUploadUtil.IMAGE_PATTERN);

                // deterministic name & path => will overwrite same public_id
                final String fileName = "thumbnail";
                final CloudinaryResDto res = cloudinaryService.uploadFile(
                                file, fileName, "products", productId.toString(), "thumbnail");

                // persist new metadata
                product.setThumbnailUrl(res.getUrl());
                product.setThumbnailPublicId(res.getPublicId()); // same as before, but keep in sync
                product.setThumbnailVersion(res.getVersion());
                productRepository.save(product);

                return toMediaResponse(product);
        }

        @Override
        @Transactional
        public ProductMediaResponse updateGalleryImage(UUID productId, UUID imageId, MultipartFile file) {
                final Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new IdInvalidException("Product not found"));

                final ProductImage img = productImageRepository.findById(imageId)
                                .orElseThrow(() -> new FuncErrorException("Image not found"));

                if (!img.getProduct().getId().equals(productId)) {
                        throw new FuncErrorException("Image does not belong to the specified product");
                }

                // validate
                FileUploadUtil.assertAllowed(file, FileUploadUtil.IMAGE_PATTERN);

                // Reuse the SAME public_id: extract the base name (last segment) and re-upload
                // publicId example: "products/{productId}/images/img-3"
                final String publicId = img.getPublicId();
                final String fileName = extractBaseNameFromPublicId(publicId); // -> "img-3"

                final CloudinaryResDto res = cloudinaryService.uploadFile(
                                file, fileName, "products", productId.toString(), "gallery");

                // Update entity with new URL/version (publicId should remain same)
                img.setUrl(res.getUrl());
                img.setVersion(res.getVersion());
                img.setPublicId(res.getPublicId()); // should match previous value; set anyway to keep in sync
                productImageRepository.save(img);

                return toMediaResponse(product);
        }

        @Override
        @Transactional
        public ProductMediaResponse deleteThumbnail(UUID productId) {
                final Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new IdInvalidException("Product not found"));

                final String publicId = product.getThumbnailPublicId();

                // Best-effort: try to delete from Cloudinary; don't let a failure poison DB
                // state
                if (publicId != null && !publicId.isBlank()) {
                        try {
                                cloudinaryService.deleteFile(publicId);
                        } catch (Exception ignored) {
                                throw new CloudinaryException("Cloudinary: Something went wrong!");
                        }
                }

                // Clear thumbnail fields on the product
                product.setThumbnailUrl(null);
                product.setThumbnailPublicId(null);
                product.setThumbnailVersion(null);

                productRepository.save(product);

                // Return the current media state (no thumbnail; gallery unchanged)
                return toMediaResponse(product);
        }

        @Override
        @Transactional
        public ProductMediaResponse deleteGalleryImage(UUID productId, UUID imageId) {
                // 1) Load product
                final Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new IdInvalidException("Product not found"));

                // 2) Load image and verify ownership
                final ProductImage img = productImageRepository.findById(imageId)
                                .orElseThrow(() -> new IdInvalidException("Image not found"));

                if (!img.getProduct().getId().equals(productId)) {
                        throw new FuncErrorException("Image does not belong to the specified product");
                }

                // 3) Best-effort Cloudinary delete (don't poison DB state on failure)
                final String publicId = img.getPublicId();
                if (publicId != null && !publicId.isBlank()) {
                        try {
                                cloudinaryService.deleteFile(publicId);
                        } catch (Exception ignored) {
                                throw new CloudinaryException("Cloudinary: Something went wrong!");
                        }
                }

                // 4) Remove from product & DB
                product.getImages().remove(img);
                productImageRepository.delete(img);

                // 5) Compact sortOrder (optional but nice to keep UI stable)
                List<ProductImage> ordered = product.getImages().stream()
                                .sorted(Comparator
                                                .comparing((ProductImage i) -> i.getSortOrder() == null
                                                                ? Integer.MAX_VALUE
                                                                : i.getSortOrder())
                                                .thenComparing(ProductImage::getCreatedAt)) // assuming BaseEntity has
                                                                                            // createdAt
                                .toList();

                int order = 1;
                for (ProductImage i : ordered) {
                        i.setSortOrder(order++);
                }
                // saveAll not strictly required if in persistence context, but explicit is
                // fine:
                productImageRepository.saveAll(ordered);

                // 6) Return current media state
                return toMediaResponse(product);
        }

        // ==== Helper =====
        private ProductMediaResponse toMediaResponse(Product p) {
                // Base (original) URLs + identifiers for gallery
                final List<ProductImageDto> gallery = (p.getImages() == null ? List.<ProductImageDto>of()
                                : p.getImages().stream()
                                                .map(i -> new ProductImageDto(
                                                                i.getId(),
                                                                i.getUrl(), // base secure URL (no transforms)
                                                                i.getPublicId(),
                                                                i.getVersion(),
                                                                i.getSortOrder()))
                                                .toList());

                // Return base secure URL for thumbnail; frontend will add transforms as needed
                return new ProductMediaResponse(
                                p.getThumbnailUrl(), // base secure URL (e.g.,
                                                     // .../image/upload/v{version}/products/{id}/thumbnail)
                                p.getThumbnailPublicId(),
                                p.getThumbnailVersion(),
                                gallery);
        }

        private static String extractBaseNameFromPublicId(String publicId) {
                if (publicId == null || publicId.isBlank())
                        return "img";
                int slash = publicId.lastIndexOf('/');
                return (slash >= 0 && slash < publicId.length() - 1) ? publicId.substring(slash + 1) : publicId;
        }
}
