package Bazaar.com.project.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import Bazaar.com.project.model.Order.Order;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByBuyerId(UUID buyerId);
}
