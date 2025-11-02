package Bazaar.com.project.feature.User.service;

import java.util.UUID;

import Bazaar.com.project.feature.User.dto.UserCreateResponseDTO;
import Bazaar.com.project.feature.User.model.User;

public interface UserService {
    User fetchUserById(UUID id);

    User fetchUserByUsername(String username);

    User fetchUserByEmail(String email);

    UserCreateResponseDTO convertToCreateDTO(User user);

    void updateUserToken(String token, String email);

    User getUserByRefreshTokenAndEmail(String refresh_token, String email);
}
