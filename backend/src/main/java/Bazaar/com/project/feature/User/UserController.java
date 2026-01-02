package Bazaar.com.project.feature.User;

import java.util.List;
import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import Bazaar.com.project.exception.UserNotFoundException;
import Bazaar.com.project.feature.Order.dto.OrderResponseDto;
import Bazaar.com.project.feature.Order.service.OrderService;
import Bazaar.com.project.feature.User.dto.UserProfileResponseDto;
import Bazaar.com.project.feature.User.dto.UserProfileUpdateRequest;
import Bazaar.com.project.feature.User.service.UserProfileService;
import Bazaar.com.project.feature._common.annotation.ApiMessage;
import Bazaar.com.project.util.SecurityUtil;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {
    private final OrderService orderService;
    private final UserProfileService profileService;

    public UserController(OrderService orderService, UserProfileService profileService) {
        this.orderService = orderService;
        this.profileService = profileService;
    }

    @GetMapping("/me/orders")
    @ApiMessage("Orders of user fetch successfully")
    public ResponseEntity<List<OrderResponseDto>> getOrdersByUserId() {
        UUID userId = SecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new UserNotFoundException("Not authenticated"));
        List<OrderResponseDto> orders = orderService.getAllOrderFromUserId(userId);
        return ResponseEntity.ok().body(orders);
    }

    @GetMapping("/me/profile")
    @ApiMessage("User profile fetched successfully")
    public ResponseEntity<UserProfileResponseDto> getProfile() {
        UUID userId = SecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new UserNotFoundException("Not authenticated"));
        return ResponseEntity.ok(profileService.getProfile(userId));
    }

    @PutMapping(path = "/me/profile", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ApiMessage("User profile updated successfully")
    public ResponseEntity<UserProfileResponseDto> updateProfile(
            @Valid @RequestBody UserProfileUpdateRequest request) {
        UUID userId = SecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new UserNotFoundException("Not authenticated"));
        return ResponseEntity.ok(profileService.updateProfile(userId, request));
    }

    @PutMapping(path = "/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ApiMessage("Avatar updated successfully")
    public ResponseEntity<?> uploadImage(@RequestPart("file") MultipartFile file) {
        UUID userId = SecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new UserNotFoundException("Not authenticated"));
        UserProfileResponseDto response = this.profileService.uploadAvatar(userId, file);
        return ResponseEntity.ok().body(response);
    }
}
