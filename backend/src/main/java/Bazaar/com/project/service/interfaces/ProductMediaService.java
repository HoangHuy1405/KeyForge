package Bazaar.com.project.service.interfaces;

import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import Bazaar.com.project.dto.ProductDto.ProductMediaResponse;

public interface ProductMediaService {
    ProductMediaResponse uploadThumbnail(UUID productId, MultipartFile file);

    ProductMediaResponse uploadGallery(UUID productId, List<MultipartFile> files);

    ProductMediaResponse updateThumbnail(UUID productId, MultipartFile file);

    ProductMediaResponse updateGalleryImage(UUID productId, UUID imageId, MultipartFile file);

    ProductMediaResponse deleteThumbnail(UUID productId);

    ProductMediaResponse deleteGalleryImage(UUID productId, UUID imageId);
}
