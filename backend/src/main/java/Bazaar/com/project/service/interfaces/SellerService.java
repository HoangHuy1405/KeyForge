package Bazaar.com.project.service.interfaces;

import java.util.UUID;

import Bazaar.com.project.dto.SellerDto.SellerShippingRequest;
import Bazaar.com.project.dto.SellerDto.SellerStartRequest;
import Bazaar.com.project.model.User.Seller;

public interface SellerService {
    Seller startRegistration(SellerStartRequest request);

    Seller configureShipping(UUID sellerId, SellerShippingRequest request);
}
