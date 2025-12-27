package Bazaar.com.project.feature.User._Auth.service;

import Bazaar.com.project.feature.User._Auth.command.CreateUserCommand;
import Bazaar.com.project.feature.User._Auth.command.LoginByUsernameOrEmailCommand;
import Bazaar.com.project.feature.User._Auth.exception.CannotLoginException;
import Bazaar.com.project.feature.User._Auth.exception.EmailAlreadyExistException;
import Bazaar.com.project.feature.User._Auth.exception.UsernameAlreadyExistException;
import Bazaar.com.project.feature.User.constant.Role;
import Bazaar.com.project.feature.User.model.User;
import Bazaar.com.project.feature.User.repository.UserRepository;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthCommandHandler {
    @Autowired
    private UserRepository userRepository;

    public User handle(LoginByUsernameOrEmailCommand command) {
        User user = userRepository.findByUsernameOrEmail(command.identifier(), command.identifier())
                .orElseThrow(CannotLoginException::new);

        if (!user.verifyPassword(command.password()))
            throw new CannotLoginException();

        return user;
    }

    public User handle(CreateUserCommand command) {
        if (userRepository.existsByEmail(command.email()))
            throw new EmailAlreadyExistException();

        if (userRepository.existsByUsername(command.username()))
            throw new UsernameAlreadyExistException();

        // Grant USER role on registration
        User user = User.builder()
                .username(command.username())
                .password(command.password())
                .email(command.email())
                .fullname(command.fullname())
                .phoneNum(command.phoneNum())
                .roles(Set.of(Role.USER))
                .build();

        return userRepository.save(user);
    }
}
