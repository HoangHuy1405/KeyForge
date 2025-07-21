package Bazaar.com.project.model.UserAggregate;

import Bazaar.com.project.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
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
    private String password;

    @Column(nullable = false)
    private String fullname;

    private String role;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String phoneNum;

    private String profilePhotoUrl;

    public boolean verifyPassword(String rawPassword){
        return this.password.equals(rawPassword);
    }
}
