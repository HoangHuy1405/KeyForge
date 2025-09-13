package Bazaar.com.project.config;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import Bazaar.com.project.model.User.Role;
import Bazaar.com.project.model.User.RoleName;
import Bazaar.com.project.model.User.User;
import Bazaar.com.project.repository.RoleRepository;
import Bazaar.com.project.repository.UserRepository;

@Configuration
public class DataInitializer {
    @Autowired
    private PasswordEncoder passwordEncoder;

    // create role in db
    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository, UserRepository userRepository) {
        return args -> {
            if (roleRepository.count() == 0) {
                roleRepository.save(Role.builder().name(RoleName.ROLE_USER).build());
                roleRepository.save(Role.builder().name(RoleName.ROLE_ADMIN).build());
                roleRepository.save(Role.builder().name(RoleName.ROLE_SELLER).build());
            }
            // --- Seed user with ADMIN + USER roles ---
            if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
                Role roleUser = roleRepository.findByName(RoleName.ROLE_USER)
                        .orElseThrow(() -> new RuntimeException("ROLE_USER not found"));
                Role roleAdmin = roleRepository.findByName(RoleName.ROLE_ADMIN)
                        .orElseThrow(() -> new RuntimeException("ROLE_ADMIN not found"));

                User adminUser = User.builder()
                        .username("admin")
                        .fullname("System Admin")
                        .email("admin@gmail.com")
                        .phoneNum("1239421")
                        .password(passwordEncoder.encode("root"))
                        .roles(new HashSet<>(Set.of(roleUser, roleAdmin)))
                        .build();

                userRepository.save(adminUser);
            }
        };
    }
}
