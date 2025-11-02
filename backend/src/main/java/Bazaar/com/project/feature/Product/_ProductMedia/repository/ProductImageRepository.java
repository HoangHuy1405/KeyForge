package Bazaar.com.project.feature.Product._ProductMedia.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Bazaar.com.project.feature.Product._ProductMedia.model.ProductImage;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, UUID> {
    List<ProductImage> findByProductIdOrderBySortOrderAscCreatedAtAsc(UUID productId);
}
