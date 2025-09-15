package Bazaar.com.project.controller;

import Bazaar.com.project.dto.AuthDto.LoginRequest;
import Bazaar.com.project.dto.AuthDto.RegisterRequest;
import Bazaar.com.project.dto.AuthDto.ResLoginDTO;
import Bazaar.com.project.dto.UserDto.UserCreateResponseDTO;
import Bazaar.com.project.exception.IdInvalidException;
import Bazaar.com.project.model.User.User;
import Bazaar.com.project.service.auth.AuthCommandHandler;
import Bazaar.com.project.service.auth.command.CreateUserCommand;
import Bazaar.com.project.service.interfaces.UserService;
import Bazaar.com.project.util.JwtUtil;
import Bazaar.com.project.util.SecurityUtil;
import Bazaar.com.project.util.Annotation.ApiMessage;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
        @Autowired
        private JwtUtil jwtUtil;
        @Autowired
        private SecurityUtil securityUtil;
        @Autowired
        private AuthCommandHandler authCommandHandler;
        @Autowired
        private AuthenticationManagerBuilder authenticationManagerBuilder;
        @Autowired
        private PasswordEncoder passwordEncoder;
        @Autowired
        private UserService userService;

        @Value("${jwt.refresh.expiration}")
        private long refreshTokenExpiration;

        @PostMapping("/register")
        @ApiMessage("User registered successfully")
        public ResponseEntity<UserCreateResponseDTO> register(@Valid @RequestBody RegisterRequest request) {
                String hashPassword = this.passwordEncoder.encode(request.password());

                var user = this.authCommandHandler.handle(
                                new CreateUserCommand(
                                                request.username(),
                                                hashPassword,
                                                request.fullname(),
                                                request.email(),
                                                request.phoneNum()));

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(this.userService.convertToCreateDTO(user));
        }

        @PostMapping("/login")
        @ApiMessage("login successfully")
        public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody LoginRequest request) {
                // Nạp input gồm username/password vào Security
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                                request.email(), request.password());

                // xác thực người dùng => cần viết hàm loadUserByUsername trong
                // UserDetailsService
                Authentication authentication = authenticationManagerBuilder.getObject()
                                .authenticate(authenticationToken);

                // set thông tin người dùng đăng nhập vào context (for others to use)
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // response
                ResLoginDTO res = new ResLoginDTO();
                User currentUser = this.userService.fetchUserByEmail(request.email());
                List<String> roleNames = null;
                if (currentUser != null) {
                        // extract user roles
                        // extract role names from user entity
                        roleNames = currentUser.getRoles().stream()
                                        .map(role -> role.getName().name()) // e.g. ROLE_USER
                                        .toList();

                        ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(
                                        currentUser.getId(),
                                        currentUser.getEmail(),
                                        currentUser.getUsername(),
                                        currentUser.getProfilePhotoUrl(),
                                        roleNames);

                        res.setUser(userLogin);

                }
                // create a token
                String access_token = this.jwtUtil.generateAccessToken(request.email(), res, roleNames);
                res.setAccessToken(access_token);

                // generate refresh_token
                String refresh_token = this.jwtUtil.generateRefreshToken(request.email(), res);
                this.userService.updateUserToken(refresh_token, request.email());

                // Set cookies
                ResponseCookie resCookie = ResponseCookie
                                .from("refresh_token", refresh_token)
                                .httpOnly(true)
                                .secure(true)
                                .path("/")
                                .maxAge(refreshTokenExpiration)
                                .build();

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, resCookie.toString())
                                .body(res);
        }

        @GetMapping("/account")
        @ApiMessage("fetch account")
        public ResponseEntity<ResLoginDTO.UserGetAccount> getAccount() {
                String email = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get()
                                : "";

                User currentUser = this.userService.fetchUserByEmail(email);
                ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin();
                ResLoginDTO.UserGetAccount userGetAccount = new ResLoginDTO.UserGetAccount();

                if (currentUser != null) {
                        userLogin.setId(currentUser.getId());
                        userLogin.setEmail(currentUser.getEmail());
                        userLogin.setName(currentUser.getUsername());
                        userGetAccount.setUser(userLogin);
                }

                return ResponseEntity.ok().body(userGetAccount);
        }

        // Get new refresh token when access token outdated
        @PostMapping("/refresh")
        @ApiMessage("Get refresh_token")
        public ResponseEntity<ResLoginDTO> getRefreshToken(
                        @CookieValue(name = "refresh_token") String refresh_token) {
                /**
                 * Exception 1: refresh_token may be null (not found)
                 * Exception 2: refresh_token and email may not found/match in database
                 * (invalid)
                 */

                // Check valid
                Jwt decodedToken = this.securityUtil.checkValidRefreshToken(refresh_token);
                String email = decodedToken.getSubject();

                // Check token, email exists in db (double check)
                // (refresh_token may exist only in cookie prior)
                User currentUser = this.userService.getUserByRefreshTokenAndEmail(refresh_token, email);

                // Create response and access token
                ResLoginDTO res = new ResLoginDTO();

                List<String> roleNames = null;
                if (currentUser != null) {

                        // extract role
                        roleNames = currentUser.getRoles().stream()
                                        .map(role -> role.getName().name()) // e.g. ROLE_USER
                                        .toList();
                        ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(
                                        currentUser.getId(),
                                        currentUser.getEmail(),
                                        currentUser.getUsername(),
                                        currentUser.getProfilePhotoUrl(),
                                        roleNames);
                        res.setUser(userLogin);

                }

                // create access token
                String access_token = this.jwtUtil.generateAccessToken(email, res, roleNames);
                res.setAccessToken(access_token);

                // create new refresh token
                String new_refresh_token = this.jwtUtil.generateRefreshToken(email, res);
                // update user in db (override old one)
                this.userService.updateUserToken(new_refresh_token, email);

                ResponseCookie resCookie = ResponseCookie
                                .from("refresh_token",
                                                new_refresh_token)
                                .httpOnly(true)
                                .secure(true)
                                .path("/")
                                .maxAge(refreshTokenExpiration)
                                .build();

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, resCookie.toString())
                                .body(res);
        }

        @PostMapping("/logout")
        @ApiMessage("Logout successfully")
        public ResponseEntity<Void> logout() {
                String email = SecurityUtil.getCurrentUserLogin().isPresent()
                                ? SecurityUtil.getCurrentUserLogin().get()
                                : "";

                if (email.equals("")) {
                        throw new IdInvalidException("email invalid");
                }
                // update refresh token in db = null
                this.userService.updateUserToken(null, email);

                // remove refresh token in cookie
                ResponseCookie deleteCookie = ResponseCookie
                                .from("refresh_token", "")
                                .httpOnly(true)
                                .secure(true)
                                .path("/")
                                .maxAge(0)
                                .build();

                return ResponseEntity
                                .ok()
                                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                                .body(null);

        }
}
