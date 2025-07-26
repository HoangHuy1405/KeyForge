package Bazaar.com.project.service.auth;

import Bazaar.com.project.model.User.LocalAccount;
import Bazaar.com.project.model.User.User;
import Bazaar.com.project.repository.LocalAccountRepository;
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

    public User handle(LoginByUsernameOrEmailCommand command){
        var account = localAccountRepository.findByUsernameOrEmail(command.identifier(), command.identifier())
                .orElseThrow(CannotLoginException::new);

        if (!account.verifyPassword(command.password()))
            throw new CannotLoginException();

        return account.getUser();
    }

    public User handle(CreateUserCommand command){
        if (localAccountRepository.existsByUsername(command.username()))
            throw new UsernameAlreadyExistException();

        if (localAccountRepository.existsByEmail(command.email()))
            throw new EmailAlreadyExistException();

        LocalAccount account = LocalAccount.builder()
                .username(command.username())
                .email(command.email())
                .password(command.password())
                .build();

        User user = account.createUser(command.fullname(), command.phoneNum());
        localAccountRepository.save(account);

        return user;
    }

}
