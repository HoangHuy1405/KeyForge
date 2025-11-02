package Bazaar.com.project.feature.User._Seller.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import Bazaar.com.project.feature.User._Seller.dto.SellerShippingRequest;
import Bazaar.com.project.feature.User._Seller.dto.SellerStartRequest;
import Bazaar.com.project.feature.User._Seller.repository.SellerRepository;
import Bazaar.com.project.feature.User.model.Role;
import Bazaar.com.project.feature.User.model.RoleName;
import Bazaar.com.project.feature.User.model.Seller;
import Bazaar.com.project.feature.User.model.User;
import Bazaar.com.project.feature.User.repository.RoleRepository;
import Bazaar.com.project.feature.User.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {
        private final SellerRepository sellerRepository;
        private final UserRepository userRepository;
        private final RoleRepository roleRepository;

        @Override
        public Seller startRegistration(SellerStartRequest request) {
                User user = userRepository.findById(
                                request.userId())
                                .orElseThrow(() -> new IllegalArgumentException("User not found"));

                if (sellerRepository.findByUser(user).isPresent()) {
                        throw new IllegalStateException("User is already a seller");
                }

                Seller seller = Seller.builder()
                                .storeName(request.storeName())
                                .email(request.email())
                                .phoneNum(request.phoneNum())
                                .rating(0.0)
                                .address(request.address())
                                .user(user)
                                .build();

                return sellerRepository.save(seller);
        }

        @Override
        public Seller configureShipping(UUID sellerId, SellerShippingRequest request) {
                Seller seller = sellerRepository.findById(sellerId)
                                .orElseThrow(() -> new IllegalArgumentException("Seller not found"));

                Seller.ShippingOptions options = new Seller.ShippingOptions(
                                request.express() != null ? request.express() : false,
                                request.standard() != null ? request.standard() : true,
                                request.economy() != null ? request.economy() : false);

                User user = userRepository.findById(sellerId)
                                .orElseThrow(() -> new IllegalArgumentException("User not found"));

                seller.setShippingOptions(options);
                seller.setUser(user);
                // ✅ Fetch managed Role entity
                Role sellerRole = roleRepository.findByName(RoleName.ROLE_SELLER)
                                .orElseThrow(() -> new IllegalStateException("ROLE_SELLER not initialized in DB"));
                // Grant ROLE_SELLER if not already present
                boolean hasSellerRole = user.getRoles().stream()
                                .anyMatch(r -> r.getName() == RoleName.ROLE_SELLER);
                if (!hasSellerRole) {
                        user.getRoles().add(sellerRole);
                        userRepository.save(user);
                }

                userRepository.save(user);
                return sellerRepository.save(seller);
        }
}
