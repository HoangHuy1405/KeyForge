package Bazaar.com.project.feature._common.cloudinary;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;

import Bazaar.com.project.exception.FuncErrorException;
import jakarta.transaction.Transactional;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {
    @Autowired
    private Cloudinary cloudinary;

    @Override
    @Transactional
    public CloudinaryResDto uploadFile(final MultipartFile file, final String fileName, final String... paths) {
        try {
            // (Optional) validate file size/type with your util
            // FileUploadUtil.assertAllowed(file, FileUploadUtil.IMAGE_PATTERN);

            final String safeName = normalizeFileName(fileName);
            final String baseName = stripExtension(safeName); // public_id should not include the extension
            final String folder = joinFolder(paths); // e.g., "users/123/avatars"

            // Build options
            Map<String, Object> opts = new java.util.HashMap<>();
            if (!folder.isBlank()) {
                opts.put("folder", folder); // Let Cloudinary handle folders
            }
            opts.put("public_id", baseName); // Final public_id = "<folder>/<baseName>"
            opts.put("overwrite", true); // Optional: overwrite if same id exists
            opts.put("invalidate", true); // Purge CDN cache on overwrite

            final Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), opts);

            final String url = (String) result.get("secure_url");
            final String publicId = (String) result.get("public_id");
            final Number version = (Number) result.get("version");

            return CloudinaryResDto.builder()
                    .publicId(publicId)
                    .url(url)
                    .version(version != null ? version.longValue() : null)
                    .build();

        } catch (final Exception e) {
            throw new FuncErrorException("Failed to upload file: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void deleteFile(final String publicId) {
        try {
            if (publicId == null || publicId.isBlank()) {
                throw new IllegalArgumentException("publicId must not be null or blank");
            }

            // destroy the asset and purge from CDN
            Map<String, Object> opts = new HashMap<>();
            opts.put("invalidate", true);

            Map<?, ?> result = cloudinary.uploader().destroy(publicId, opts);

            String status = (String) result.get("result");
            if (!"ok".equalsIgnoreCase(status) && !"not found".equalsIgnoreCase(status)) {
                // Cloudinary returns "not found" if the publicId doesn’t exist, which you may
                // choose to ignore
                throw new FuncErrorException("Failed to delete file: status=" + status);
            }

        } catch (Exception e) {
            throw new FuncErrorException("Failed to delete file: " + e.getMessage());
        }
    }

    private static String joinFolder(String... paths) {
        if (paths == null || paths.length == 0)
            return "";
        return java.util.Arrays.stream(paths)
                .filter(s -> s != null && !s.isBlank())
                .map(CloudinaryServiceImpl::sanitizeSegment)
                .reduce((a, b) -> a + "/" + b)
                .orElse("");
    }

    /** Remove leading/trailing slashes and spaces inside a path segment */
    private static String sanitizeSegment(String s) {
        String trimmed = s.trim().replace("\\", "/");
        // collapse multiple slashes and strip edges
        trimmed = trimmed.replaceAll("/+", "/");
        if (trimmed.startsWith("/"))
            trimmed = trimmed.substring(1);
        if (trimmed.endsWith("/"))
            trimmed = trimmed.substring(0, trimmed.length() - 1);
        return trimmed;
    }

    private static String normalizeFileName(String name) {
        if (name == null)
            return "file";
        // simple safe normalization for public_id purposes
        return name.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private static String stripExtension(String name) {
        int i = name.lastIndexOf('.');
        return (i == -1) ? name : name.substring(0, i);
    }
}
