package Bazaar.com.project.repository;

import Bazaar.com.project.model.User.LocalAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LocalAccountRepository extends JpaRepository<LocalAccount, UUID> {
    Optional<LocalAccount> findByUsernameOrEmail(String username, String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
