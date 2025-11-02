package Bazaar.com.project.feature.User._Seller.service;

import java.util.UUID;

import Bazaar.com.project.feature.User._Seller.dto.SellerShippingRequest;
import Bazaar.com.project.feature.User._Seller.dto.SellerStartRequest;
import Bazaar.com.project.feature.User.model.Seller;

public interface SellerService {
    Seller startRegistration(SellerStartRequest request);

    Seller configureShipping(UUID sellerId, SellerShippingRequest request);
}
