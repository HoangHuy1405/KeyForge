package Bazaar.com.project.feature.Product._ProductMedia.service;

import java.util.List;
import java.util.UUID;

import org.springframework.lang.NonNull;
import org.springframework.web.multipart.MultipartFile;

import Bazaar.com.project.feature.Product._ProductMedia.dto.ProductMediaResponse;

public interface ProductMediaService {
    ProductMediaResponse uploadThumbnail(@NonNull UUID productId, MultipartFile file);

    ProductMediaResponse uploadGallery(@NonNull UUID productId, List<MultipartFile> files);

    ProductMediaResponse updateThumbnail(@NonNull UUID productId, MultipartFile file);

    ProductMediaResponse updateGalleryImage(@NonNull UUID productId, @NonNull UUID imageId, MultipartFile file);

    ProductMediaResponse deleteThumbnail(@NonNull UUID productId);

    ProductMediaResponse deleteGalleryImage(@NonNull UUID productId, @NonNull UUID imageId);
}
