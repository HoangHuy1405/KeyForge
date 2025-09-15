package Bazaar.com.project.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Bazaar.com.project.dto.SellerDto.SellerCreateResponse;
import Bazaar.com.project.dto.SellerDto.SellerShippingRequest;
import Bazaar.com.project.dto.SellerDto.SellerStartRequest;
import Bazaar.com.project.model.User.Seller;
import Bazaar.com.project.service.interfaces.SellerService;
import Bazaar.com.project.util.Annotation.ApiMessage;

@RestController
@RequestMapping("/api/sellers")
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
    @PostMapping("/{sellerId}/shipping")
    public ResponseEntity<SellerCreateResponse> configureShipping(
            @PathVariable UUID sellerId,
            @RequestBody SellerShippingRequest request) {
        Seller seller = sellerService.configureShipping(sellerId, request);
        SellerCreateResponse response = toSellerResponse(seller);
        return ResponseEntity.ok(response);
    }

    private SellerCreateResponse toSellerResponse(Seller seller) {
        return SellerCreateResponse.builder()
                .sellerId(seller.getId())
                .storeName(seller.getStoreName())
                .email(seller.getEmail())
                .phoneNum(seller.getPhoneNum())
                .address(seller.getAddress())
                .rating(seller.getRating())
                .express(seller.getShippingOptions().getExpress())
                .standard(seller.getShippingOptions().getStandard())
                .economy(seller.getShippingOptions().getEconomy())
                .build();
    }
}
