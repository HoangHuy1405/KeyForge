package Bazaar.com.project.feature.User.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import Bazaar.com.project.feature.User.model.Role;
import Bazaar.com.project.feature.User.model.RoleName;
import lombok.NonNull;

public interface RoleRepository extends JpaRepository<Role, UUID> {
    @NonNull
    Optional<Role> findByName(RoleName name);
}
