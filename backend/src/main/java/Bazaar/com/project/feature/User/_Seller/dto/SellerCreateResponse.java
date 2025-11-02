package Bazaar.com.project.feature.User._Seller.dto;

import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SellerCreateResponse {
    private UUID sellerId;
    private String storeName;
    private String email;
    private String phoneNum;
    private String address;
    private double rating;

    private Boolean express;
    private Boolean standard;
    private Boolean economy;
}
