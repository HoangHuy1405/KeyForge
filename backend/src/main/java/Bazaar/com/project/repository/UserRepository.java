package Bazaar.com.project.repository;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Bazaar.com.project.model.UserAggregate.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsernameOrEmail(String username, String email);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByRefreshTokenAndEmail(String refreshToken, String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

}