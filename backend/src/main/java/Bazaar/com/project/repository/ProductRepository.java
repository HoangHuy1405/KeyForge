package Bazaar.com.project.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import Bazaar.com.project.model.Product.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {
    Optional<Product> findByIdAndSellerId(UUID id, UUID sellerId);

    List<Product> findBySellerId(UUID sellerId);
}
