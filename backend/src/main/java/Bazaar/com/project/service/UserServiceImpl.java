package Bazaar.com.project.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Bazaar.com.project.model.UserAggregate.User;
import Bazaar.com.project.repository.UserRepository;
import Bazaar.com.project.service.interfaces.UserService;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public User fetchUserById(UUID id) {
        Optional<User> userOptional = this.userRepository.findById(id);
        if(userOptional.isPresent()) {
            return userOptional.get();
        }
        return null;
    }

    @Override
    public User fetchUserByUsername(String username) {
        Optional<User> userOptional = this.userRepository.findByUsername(username);
        if(userOptional.isPresent()) {
            return userOptional.get();
        }
        return null;
    }
    
}
