package Bazaar.com.project.feature._common.cloudinary;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {
    CloudinaryResDto uploadFile(final MultipartFile file, final String fileName, final String... paths);

    void deleteFile(final String publicId);
}
