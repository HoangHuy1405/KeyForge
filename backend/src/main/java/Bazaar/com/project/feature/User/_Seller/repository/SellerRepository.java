package Bazaar.com.project.feature.User._Seller.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import Bazaar.com.project.feature.User.model.Seller;
import Bazaar.com.project.feature.User.model.User;

public interface SellerRepository extends JpaRepository<Seller, UUID> {
    Optional<Seller> findByUser(User user);
}
