package Bazaar.com.project.model.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Table(name = "Local_accounts")
@Builder
@Getter
@Setter
@Entity
public class LocalAccount extends Account {
    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String email;

    public boolean verifyPassword(String rawPassword){
        return this.password.equals(rawPassword);
    }
}
