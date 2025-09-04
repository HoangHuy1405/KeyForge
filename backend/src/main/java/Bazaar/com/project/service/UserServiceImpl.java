package Bazaar.com.project.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import Bazaar.com.project.dto.UserDto.UserCreateResponseDTO;
import Bazaar.com.project.exception.UserNotFoundException;
import Bazaar.com.project.model.User.User;
import Bazaar.com.project.repository.UserRepository;
import Bazaar.com.project.service.interfaces.UserService;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public User fetchUserById(UUID id) {
        Optional<User> userOptional = this.userRepository.findById(id);
        return userOptional.orElse(null);
    }

    @Override
    public User fetchUserByUsername(String username) {
        Optional<User> userOptional = this.userRepository.findByUsername(username);
        return userOptional.orElse(null);
    }

    @Override
    public User fetchUserByEmail(String email) {
        Optional<User> userOptional = this.userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new UserNotFoundException(
                    String.format("User cannot be found with email: %s", email));
        }
        return userOptional.get();
    }

    @Override
    public UserCreateResponseDTO convertToCreateDTO(User user) {
        if (user == null) {
            return null;
        }
        UserCreateResponseDTO dto = new UserCreateResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFullname(user.getFullname());
        dto.setEmail(user.getEmail());
        dto.setPhoneNum(user.getPhoneNum());
        dto.setAddress(user.getDescription());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    @Override
    public void updateUserToken(String token, String email) {
        User currentUser = this.fetchUserByEmail(email);
        if (currentUser != null) {
            currentUser.setRefreshToken(token);
            this.userRepository.save(currentUser);
        }
    }

    @Override
    public User getUserByRefreshTokenAndEmail(String refresh_token, String email) {
        Optional<User> optUser = this.userRepository.findByRefreshTokenAndEmail(refresh_token, email);
        if (optUser.isEmpty()) {
            throw new UserNotFoundException(
                    String.format("User with email %s and refresh token not found", email));
        }
        return optUser.get();
    }
}
