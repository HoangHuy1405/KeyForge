package Bazaar.com.project.feature.User._Seller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonProperty;

public record SellerStartRequest(
                @JsonProperty("storeName") @NotBlank @Size(max = 50) String storeName,

                @JsonProperty("email") @NotBlank @jakarta.validation.constraints.Email String email,

                @JsonProperty("phoneNum") @NotBlank String phoneNum,

                @JsonProperty("address") @NotBlank String address,

                @JsonProperty("userId") @NotNull java.util.UUID userId) {
}
