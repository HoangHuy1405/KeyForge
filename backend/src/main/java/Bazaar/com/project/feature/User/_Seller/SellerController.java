package Bazaar.com.project.feature.User._Seller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Bazaar.com.project.feature.User._Seller.dto.SellerCreateResponse;
import Bazaar.com.project.feature.User._Seller.dto.SellerStartRequest;
import Bazaar.com.project.feature.User._Seller.service.SellerService;
import Bazaar.com.project.feature.User.model.Seller;
import Bazaar.com.project.feature._common.annotation.ApiMessage;

@RestController
@RequestMapping("/sellers")
public class SellerController {
    @Autowired
    private SellerService sellerService;

    // Step 1: Create seller draft
    @PostMapping
    @ApiMessage("Seller start registration successfully")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<SellerCreateResponse> startRegistration(@RequestBody SellerStartRequest request) {
        Seller seller = sellerService.startRegistration(request);
        SellerCreateResponse response = toSellerResponse(seller);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Step 2: Configure shipping
    // @PostMapping("/shipping")
    // @PreAuthorize("hasAnyAuthority('SELLER', 'ADMIN')")
    // public ResponseEntity<SellerCreateResponse> configureShipping(
    // @RequestBody SellerShippingRequest request) {
    // UUID sellerId = SecurityUtil.getCurrentUserId()
    // .orElseThrow(() -> new UserNotFoundException("Not authenticated"));
    // Seller seller = sellerService.configureShipping(sellerId, request);
    // SellerCreateResponse response = toSellerResponse(seller);
    // return ResponseEntity.ok(response);
    // }

    private SellerCreateResponse toSellerResponse(Seller seller) {
        return SellerCreateResponse.builder()
                .sellerId(seller.getId())
                .storeName(seller.getStoreName())
                .email(seller.getEmail())
                .phoneNum(seller.getPhoneNum())
                .address(seller.getAddress())
                .rating(seller.getRating())
                .build();
    }
}
