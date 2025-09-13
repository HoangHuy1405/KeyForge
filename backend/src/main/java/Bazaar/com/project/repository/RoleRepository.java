package Bazaar.com.project.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import Bazaar.com.project.model.User.Role;
import Bazaar.com.project.model.User.RoleName;

public interface RoleRepository extends JpaRepository<Role, UUID> {
    Optional<Role> findByName(RoleName name);
}
