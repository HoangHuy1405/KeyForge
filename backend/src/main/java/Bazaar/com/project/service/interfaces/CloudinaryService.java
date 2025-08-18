package Bazaar.com.project.service.interfaces;

import org.springframework.web.multipart.MultipartFile;

import Bazaar.com.project.dto.CloudinaryResDto;

public interface CloudinaryService {
    CloudinaryResDto uploadFile(final MultipartFile file, final String fileName, final String... paths);
}
