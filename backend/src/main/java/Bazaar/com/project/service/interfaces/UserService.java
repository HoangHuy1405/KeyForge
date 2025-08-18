package Bazaar.com.project.service.interfaces;

import java.util.UUID;
import Bazaar.com.project.dto.UserDto.UserCreateResponseDTO;
import Bazaar.com.project.model.UserAggregate.User;

public interface UserService {
    User fetchUserById(UUID id);

    User fetchUserByUsername(String username);

    User fetchUserByEmail(String email);

    UserCreateResponseDTO convertToCreateDTO(User user);

    void updateUserToken(String token, String email);

    User getUserByRefreshTokenAndEmail(String refresh_token, String email);
}
