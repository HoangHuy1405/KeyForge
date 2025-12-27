package Bazaar.com.project.config;

import java.util.HashSet;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import Bazaar.com.project.feature.User._Seller.repository.SellerRepository;
import Bazaar.com.project.feature.User.constant.Role;
import Bazaar.com.project.feature.User.model.Seller;
import Bazaar.com.project.feature.User.model.User;
import Bazaar.com.project.feature.User.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;

    @Override
    @Transactional
    public void run(String... args) {
        String encodedPassword = passwordEncoder.encode("root");

        // --- Seed normal user with USER role ---
        if (userRepository.findByEmail("user@example.com").isEmpty()) {
            Set<Role> userRoles = new HashSet<>();
            userRoles.add(Role.USER);

            User normalUser = User.builder()
                    .username("user")
                    .fullname("Normal User")
                    .email("user@example.com")
                    .phoneNum("1234567890")
                    .password(encodedPassword)
                    .description("A regular user account")
                    .roles(userRoles)
                    .build();
            userRepository.save(normalUser);
        }

        // --- Seed seller user with USER + SELLER roles ---
        User sellerUser = userRepository.findByEmail("seller@example.com").orElse(null);

        if (sellerUser == null) {
            Set<Role> sellerRoles = new HashSet<>();
            sellerRoles.add(Role.USER);
            sellerRoles.add(Role.SELLER);

            sellerUser = User.builder()
                    .username("seller")
                    .fullname("Seller User")
                    .email("seller@example.com")
                    .phoneNum("0987654321")
                    .password(encodedPassword)
                    .description("A seller account")
                    .roles(sellerRoles)
                    .build();
            sellerUser = userRepository.saveAndFlush(sellerUser);
        }

        // Check if Seller entity exists (separately from User)
        if (sellerRepository.findByUser(sellerUser).isEmpty()) {
            Seller seller = Seller.builder()
                    .user(sellerUser)
                    .storeName("Demo Store")
                    .email("seller@example.com")
                    .phoneNum("0987654321")
                    .address("123 Main St")
                    .rating(0.0)
                    .build();
            sellerRepository.save(seller);
        }

        // --- Seed admin user with USER + ADMIN roles ---
        if (userRepository.findByEmail("admin@example.com").isEmpty()) {
            Set<Role> adminRoles = new HashSet<>();
            adminRoles.add(Role.USER);
            adminRoles.add(Role.ADMIN);

            User adminUser = User.builder()
                    .username("admin")
                    .fullname("System Admin")
                    .email("admin@example.com")
                    .phoneNum("1239421")
                    .password(encodedPassword)
                    .description("Administrator account")
                    .roles(adminRoles)
                    .build();
            userRepository.save(adminUser);
        }
    }
}
