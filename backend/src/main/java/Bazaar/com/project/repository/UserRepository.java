package Bazaar.com.project.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import Bazaar.com.project.model.User;

public interface UserRepository extends JpaRepository<User, UUID> {

    
} 