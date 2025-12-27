package Bazaar.com.project.feature.User._Seller.service;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;

import Bazaar.com.project.exception.InvalidArgumentException;
import Bazaar.com.project.exception.UserNotFoundException;
import Bazaar.com.project.feature.User._Seller.dto.SellerShippingRequest;
import Bazaar.com.project.feature.User._Seller.dto.SellerStartRequest;
import Bazaar.com.project.feature.User._Seller.repository.SellerRepository;
import Bazaar.com.project.feature.User.constant.Role;
import Bazaar.com.project.feature.User.model.Seller;
import Bazaar.com.project.feature.User.model.User;
import Bazaar.com.project.feature.User.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {
        private final SellerRepository sellerRepository;
        private final UserRepository userRepository;

        @Override
        public Seller startRegistration(SellerStartRequest request) {
                User user = userRepository.findById(request.userId())
                                .orElseThrow(() -> new UserNotFoundException("User not found"));

                if (sellerRepository.findByUser(user).isPresent()) {
                        throw new InvalidArgumentException("User is already a seller");
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
                                .orElseThrow(() -> new UserNotFoundException("Seller not found"));

                User user = seller.getUser();

                // Grant SELLER role if not already present
                if (!user.getRoles().contains(Role.SELLER)) {
                        Set<Role> updatedRoles = new HashSet<>(user.getRoles());
                        updatedRoles.add(Role.SELLER);
                        user.setRoles(updatedRoles);
                        userRepository.save(user);
                }

                return sellerRepository.save(seller);
        }
}
