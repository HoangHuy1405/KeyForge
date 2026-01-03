package Bazaar.com.project.feature.Order.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import Bazaar.com.project.feature.Order.model.Order;

public interface OrderRepository extends JpaRepository<Order, UUID>, JpaSpecificationExecutor<Order> {
    List<Order> findByBuyerId(UUID buyerId);

    Page<Order> findByCreatedBy(String createdBy, Pageable pageable);

    /**
     * Find all orders that contain at least one product from the specified seller
     */
    @Query("SELECT DISTINCT o FROM Order o JOIN o.items oi JOIN oi.product p WHERE p.seller.id = :sellerId")
    List<Order> findOrdersBySellerId(@Param("sellerId") UUID sellerId);

    /**
     * Find orders by seller with pagination
     */
    @Query("SELECT DISTINCT o FROM Order o JOIN o.items oi JOIN oi.product p WHERE p.seller.id = :sellerId")
    Page<Order> findOrdersBySellerIdPageable(@Param("sellerId") UUID sellerId, Pageable pageable);
}
