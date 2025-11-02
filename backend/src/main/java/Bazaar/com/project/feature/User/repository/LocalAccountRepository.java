package Bazaar.com.project.feature.User.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Bazaar.com.project.feature.User.model.LocalAccount;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LocalAccountRepository extends JpaRepository<LocalAccount, UUID> {
    Optional<LocalAccount> findByUsernameOrEmail(String username, String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
