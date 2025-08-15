package Bazaar.com.project.model.User;

import Bazaar.com.project.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
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
    @Column(nullable = false)
    private String fullname;

    private String role;

    @Column(unique = true, nullable = false)
    @Email(message = "Email is not valid", regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
    private String email;

    @Column(columnDefinition = "text")
    private String description;

    @Column(nullable = false)
    private Role role;

    @Column(unique = true)
    private String phoneNum;

    private String profilePhotoUrl;

    @Column(columnDefinition = "text")
    private String refreshToken;

    public boolean verifyPassword(String rawPassword) {
        return this.password.equals(rawPassword);
    }
}
