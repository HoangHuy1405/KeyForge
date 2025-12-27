package Bazaar.com.project.feature.Product._ProductMedia;

import java.util.List;
import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import Bazaar.com.project.feature.Product._ProductMedia.dto.ProductMediaResponse;
import Bazaar.com.project.feature.Product._ProductMedia.service.ProductMediaServiceImpl;
import Bazaar.com.project.feature._common.annotation.ApiMessage;

@RestController
@RequestMapping("/products/{productId}/media")
@PreAuthorize("hasAnyAuthority('SELLER', 'ADMIN')")
public class ProductMediaController {
    private final ProductMediaServiceImpl productMediaService;

    public ProductMediaController(ProductMediaServiceImpl productMediaService) {
        this.productMediaService = productMediaService;
    }

    @PostMapping(path = "/thumbnail", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ApiMessage("Thumbnail uploaded successfully")
    public ProductMediaResponse uploadThumbnail(
            @PathVariable UUID productId,
            @RequestPart("file") MultipartFile file) {
        return productMediaService.uploadThumbnail(productId, file);
    }

    @PostMapping(path = "/gallery", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ApiMessage("Gallery Image uploaded successfully")
    public ProductMediaResponse uploadGallery(
            @PathVariable UUID productId,
            @RequestPart("files") List<MultipartFile> files) {
        return productMediaService.uploadGallery(productId, files);
    }

    @PutMapping(path = "/thumbnail", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ApiMessage("Thumbnail updated successfully")
    public ProductMediaResponse updateThumbnail(
            @PathVariable UUID productId,
            @RequestPart("file") MultipartFile file) {
        return productMediaService.updateThumbnail(productId, file);
    }

    @PutMapping(path = "/gallery/{imageId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ApiMessage("Gallery Image updated successfully")
    public ProductMediaResponse updateGalleryImage(
            @PathVariable UUID productId,
            @PathVariable UUID imageId,
            @RequestPart("file") MultipartFile file) {
        return productMediaService.updateGalleryImage(productId, imageId, file);
    }

    @DeleteMapping("/thumbnail")
    @ApiMessage("Thumbnail deleted successfully")
    public ProductMediaResponse deleteThumbnail(@PathVariable UUID productId) {
        return productMediaService.deleteThumbnail(productId);
    }

    @DeleteMapping("/gallery/{imageId}")
    @ApiMessage("Gallery Image deleted successfully")
    public ProductMediaResponse deleteGalleryImage(
            @PathVariable UUID productId,
            @PathVariable UUID imageId) {
        return productMediaService.deleteGalleryImage(productId, imageId);
    }
}
