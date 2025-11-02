package Bazaar.com.project.feature.User.dto;

import java.time.Instant;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserCreateResponseDTO {
    private UUID id;
    private String username;
    private String fullname;
    private String email;
    private String phoneNum;
    private String address;
    private Instant createdAt;
}
