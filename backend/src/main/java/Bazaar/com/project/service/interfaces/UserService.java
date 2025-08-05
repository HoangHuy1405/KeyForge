package Bazaar.com.project.service.interfaces;

import java.util.UUID;

import Bazaar.com.project.model.UserAggregate.User;

public interface UserService {
    User fetchUserById(UUID id);
    User fetchUserByUsername(String username);
}
