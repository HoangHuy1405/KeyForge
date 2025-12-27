package Bazaar.com.project.feature.User.model;

import Bazaar.com.project.feature._common.model.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "sellers")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Seller extends BaseEntity {
    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;
    private String address;
    private String storeName;
    private String email;
    private String phoneNum;
    private double rating;
}
