package Bazaar.com.project.service.auth;

import Bazaar.com.project.model.UserAggregate.User;
import Bazaar.com.project.repository.UserRepository;
import Bazaar.com.project.service.auth.command.CreateUserCommand;
import Bazaar.com.project.service.auth.command.LoginByUsernameOrEmailCommand;
import Bazaar.com.project.service.auth.exception.CannotLoginException;
import Bazaar.com.project.service.auth.exception.EmailAlreadyExistException;
import Bazaar.com.project.service.auth.exception.UsernameAlreadyExistException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthCommandHandler {
    @Autowired
    private UserRepository userRepository;

    public User handle(LoginByUsernameOrEmailCommand command){
        var user = userRepository.findByUsernameOrEmail(command.identifier(), command.identifier())
                .orElseThrow(CannotLoginException::new);

        if (!user.verifyPassword(command.password()))
            throw new CannotLoginException();

        return user;
    }

    public User handle(CreateUserCommand command){
        if (userRepository.existsByEmail(command.email()))
            throw new EmailAlreadyExistException();

        if (userRepository.existsByUsername(command.username()))
            throw new UsernameAlreadyExistException();

        User user = User.builder()
                .username(command.username())
                .password(command.password())
                .email(command.email())
                .fullname(command.fullname())
                .phoneNum(command.phoneNum())
                .build();

        return userRepository.save(user);
    }

}
