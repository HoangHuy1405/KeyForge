package Bazaar.com.project.service.auth;

import Bazaar.com.project.model.User.Role;
import Bazaar.com.project.model.User.RoleName;
import Bazaar.com.project.model.User.User;
import Bazaar.com.project.repository.LocalAccountRepository;
import Bazaar.com.project.repository.RoleRepository;
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
    private LocalAccountRepository localAccountRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;

    public User handle(LoginByUsernameOrEmailCommand command) {
        var account = localAccountRepository.findByUsernameOrEmail(command.identifier(), command.identifier())
                .orElseThrow(CannotLoginException::new);

        if (!account.verifyPassword(command.password()))
            throw new CannotLoginException();

        return account.getUser();
    }

    public User handle(CreateUserCommand command) {
        if (userRepository.existsByEmail(command.email()))
            throw new EmailAlreadyExistException();

        if (userRepository.existsByUsername(command.username()))
            throw new UsernameAlreadyExistException();

        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("ROLE_USER not found"));

        User user = User.builder()
                .username(command.username())
                .password(command.password())
                .email(command.email())
                .fullname(command.fullname())
                .phoneNum(command.phoneNum())
                .build();

        user.getRoles().add(userRole);

        return userRepository.save(user);
    }

}
