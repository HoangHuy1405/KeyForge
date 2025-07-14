package Bazaar.com.project.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import Bazaar.com.project.model.Product;

public interface ProductRepository extends JpaRepository<Product, UUID> {}
