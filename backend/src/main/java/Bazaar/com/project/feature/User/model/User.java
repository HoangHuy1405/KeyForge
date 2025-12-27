package Bazaar.com.project.feature.User.model;

import java.util.HashSet;
import java.util.Set;

import Bazaar.com.project.feature.User.constant.Role;
import Bazaar.com.project.feature._common.model.BaseEntity;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.persistence.ForeignKey;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {
    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String fullname;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    @Email(message = "Email is not valid", regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
    private String email;

    @Column(columnDefinition = "text")
    private String description;

    @Column(unique = true)
    private String phoneNum;

    private String profilePhotoUrl;
    private String profilePhotoPublicId; // canonical
    private Long profilePhotoVersion;

    @Column(columnDefinition = "text")
    private String refreshToken;

    @ElementCollection(fetch = FetchType.EAGER, targetClass = Role.class)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "fk_user_roles_user", foreignKeyDefinition = "FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE")))
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 64)
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    public boolean verifyPassword(String rawPassword) {
        return this.password.equals(rawPassword);
    }
}
