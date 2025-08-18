package Bazaar.com.project.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import Bazaar.com.project.dto.OrderDto.OrderResponseDto;
import Bazaar.com.project.dto.UserDto.UserProfileResponseDto;
import Bazaar.com.project.dto.UserDto.UserProfileUpdateRequest;
import Bazaar.com.project.service.UserProfileService;
import Bazaar.com.project.service.interfaces.OrderService;
import Bazaar.com.project.util.Annotation.ApiMessage;
import jakarta.validation.Valid;

@RestController
@RequestMapping("api/users")
public class UserController {
    private final OrderService orderService;
    private final UserProfileService profileService;

    public UserController(OrderService orderService, UserProfileService profileService) {
        this.orderService = orderService;
        this.profileService = profileService;
    }

    @GetMapping("/{userId}/orders")
    @ApiMessage("Orders of user fetch successfully")
    public ResponseEntity<List<OrderResponseDto>> getOrdersByUserId(@PathVariable UUID userId) {
        List<OrderResponseDto> orders = orderService.getAllOrderFromUserId(userId);
        return ResponseEntity.ok().body(orders);
    }

    @GetMapping("/{userId}/profile")
    @ApiMessage("User profile fetched successfully")
    public ResponseEntity<UserProfileResponseDto> getProfile(@PathVariable UUID userId) {
        return ResponseEntity.ok(profileService.getProfile(userId));
    }

    @PutMapping(path = "/{userId}/profile", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ApiMessage("User profile updated successfully")
    public ResponseEntity<UserProfileResponseDto> updateProfile(
            @PathVariable java.util.UUID userId,
            @Valid @RequestBody UserProfileUpdateRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(userId, request));
    }

    @PutMapping(path = "/{userId}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ApiMessage("Avatar updated successfully")
    public ResponseEntity<?> uploadImage(@PathVariable UUID userId, @RequestPart("file") MultipartFile file) {
        UserProfileResponseDto response = this.profileService.uploadAvatar(userId, file);
        return ResponseEntity.ok().body(response);
    }
}
