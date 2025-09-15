package Bazaar.com.project.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import Bazaar.com.project.model.User.Seller;
import Bazaar.com.project.model.User.User;

public interface SellerRepository extends JpaRepository<Seller, UUID> {
    Optional<Seller> findByUser(User user);
}
