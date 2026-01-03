package Bazaar.com.project.feature.Order.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import Bazaar.com.project.feature.Order.model.Order;

public interface OrderRepository extends JpaRepository<Order, UUID>, JpaSpecificationExecutor<Order> {
    List<Order> findByBuyerId(UUID buyerId);

    Page<Order> findByCreatedBy(String createdBy, Pageable pageable);
}
