package Bazaar.com.project.feature.User.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;

import Bazaar.com.project.exception.FuncErrorException;
import Bazaar.com.project.exception.UserNotFoundException;
import Bazaar.com.project.feature.User.dto.UserProfileResponseDto;
import Bazaar.com.project.feature.User.dto.UserProfileUpdateRequest;
import Bazaar.com.project.feature.User.constant.Role;
import Bazaar.com.project.feature.User.model.User;
import Bazaar.com.project.feature.User.repository.UserRepository;
import Bazaar.com.project.feature._common.cloudinary.CloudinaryResDto;
import Bazaar.com.project.feature._common.cloudinary.CloudinaryService;
import Bazaar.com.project.util.FileUploadUtil;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserProfileService {

    private final UserRepository userRepository;
    private final Cloudinary cloudinary;
    private final CloudinaryService cloudinaryService;

    public UserProfileService(UserRepository userRepository, Cloudinary cloudinary,
            CloudinaryService cloudinaryService) {
        this.userRepository = userRepository;
        this.cloudinary = cloudinary;
        this.cloudinaryService = cloudinaryService;
    }

    @Transactional(readOnly = true)
    public UserProfileResponseDto getProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        String avatarUrl = buildAvatarUrl(user.getProfilePhotoPublicId(), user.getProfilePhotoVersion());

        return toDto(user, avatarUrl);
    }

    @Transactional
    public UserProfileResponseDto updateProfile(UUID userId, UserProfileUpdateRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Uniqueness guards (only if changed and non-null)
        if (req.email() != null && !req.email().equalsIgnoreCase(user.getEmail())) {
            if (userRepository.existsByEmailAndIdNot(req.email(), userId)) {
                throw new FuncErrorException("Email is already in use");
            }
            user.setEmail(req.email());
        }

        if (req.phoneNum() != null && !req.phoneNum().equals(user.getPhoneNum())) {
            if (userRepository.existsByPhoneNumAndIdNot(req.phoneNum(), userId)) {
                throw new FuncErrorException("Phone number is already in use");
            }
            user.setPhoneNum(req.phoneNum());
        }

        if (req.username() != null) {
            user.setUsername(req.username().trim());
        }

        if (req.fullname() != null) {
            user.setFullname(req.fullname().trim());
        }

        if (req.description() != null) {
            user.setDescription(req.description().trim());
        }

        if (req.dob() != null) {
            user.setDob(req.dob());
        }

        if (req.gender() != null) {
            user.setGender(req.gender());
        }

        if (req.address() != null) {
            user.setAddress(req.address().trim());
        }

        // Persist updates
        userRepository.save(user);

        String avatarUrl = buildAvatarUrl(user.getProfilePhotoPublicId(), user.getProfilePhotoVersion());
        return toDto(user, avatarUrl);
    }

    // === helpers ===
    private UserProfileResponseDto toDto(User u, String avatarUrl) {
        java.util.UUID accountId = null; // Account feature removed
        // Convert roles -> list of strings
        List<String> roleNames = u.getRoles() != null
                ? u.getRoles().stream()
                        .map(Role::name) // Role enum name
                        .toList()
                : Collections.emptyList();
        return new UserProfileResponseDto(
                u.getId(),
                u.getUsername(),
                u.getFullname(),
                u.getEmail(),
                u.getPhoneNum(),
                u.getDescription(),
                u.getDob(),
                u.getGender(),
                u.getAddress(),
                roleNames,
                avatarUrl,
                u.getProfilePhotoPublicId(),
                accountId);
    }

    /**
     * Build a small, circular, face-cropped avatar for UI.
     * Returns null if no avatar uploaded yet.
     */
    public String buildAvatarUrl(String publicId, Long version) {
        if (publicId == null || publicId.isBlank())
            return null;

        return cloudinary.url()
                .secure(true)
                .transformation(new Transformation<>()
                        .width(128).height(128)
                        .crop("thumb").gravity("face")
                        .radius("max")
                        .quality("auto")
                        .fetchFormat("auto")
                        .dpr("auto"))
                .version(version)
                .generate(publicId);
    }

    @Transactional
    public UserProfileResponseDto uploadAvatar(UUID userId, MultipartFile file) {
        final User user = this.userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // 2. Validate file (size/type)
        FileUploadUtil.assertAllowed(file, FileUploadUtil.IMAGE_PATTERN);

        // 3. Build a safe, deterministic filename (e.g. always avatar)
        final String fileName = "avatar"; // default always to avatar

        // 4. Upload to Cloudinary, under "users/<id>/avatar"
        final CloudinaryResDto response = this.cloudinaryService
                .uploadFile(file, fileName, "users", userId.toString(), "avatar");

        // 5. Save the secure URL in DB
        user.setProfilePhotoUrl(response.getUrl());
        user.setProfilePhotoPublicId(response.getPublicId());
        user.setProfilePhotoVersion(response.getVersion());
        this.userRepository.save(user);

        final String avatarUrl = buildAvatarUrl(
                user.getProfilePhotoPublicId(),
                user.getProfilePhotoVersion());
        return toDto(user, avatarUrl);
    }
}
