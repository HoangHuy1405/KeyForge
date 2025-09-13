package Bazaar.com.project.model.User;

import Bazaar.com.project.model.BaseEntity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "accounts")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
public abstract class Account extends BaseEntity {
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;

    public User createUser(String fullname, String phoneNum) {
        this.user = User.builder()
                .fullname(fullname)
                .phoneNum(phoneNum)
                .account(this)
                .build();

        return this.user;
    }
}
