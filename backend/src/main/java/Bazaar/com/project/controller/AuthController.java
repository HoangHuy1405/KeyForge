package Bazaar.com.project.controller;

import Bazaar.com.project.dto.AuthDto.LoginRequest;
import Bazaar.com.project.dto.AuthDto.RegisterRequest;
import Bazaar.com.project.dto.AuthDto.ResLoginDTO;
import Bazaar.com.project.dto.UserDto.UserCreateResponseDTO;
import Bazaar.com.project.exception.IdInvalidException;
import Bazaar.com.project.model.UserAggregate.User;
import Bazaar.com.project.service.auth.AuthCommandHandler;
import Bazaar.com.project.service.auth.command.CreateUserCommand;
import Bazaar.com.project.service.interfaces.UserService;
import Bazaar.com.project.util.JwtUtil;
import Bazaar.com.project.util.SecurityUtil;
import Bazaar.com.project.util.Annotation.ApiMessage;
import jakarta.validation.Valid;

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

        // @PostMapping("/login")
        // public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request,
        // HttpServletResponse response) {
        // var user = authCommandHandler.handle(
        // new LoginByUsernameOrEmailCommand(request.identifier(), request.password())
        // );

        // String accessToken = jwtUtil.generateAccessToken(user);
        // String refreshToken = jwtUtil.generateRefreshToken(user);

        // // Gửi refresh token qua cookie
        // ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
        // .httpOnly(true)
        // .secure(true)
        // .sameSite("Strict")
        // .path("/auth/refresh-token")
        // .maxAge(Duration.ofDays(7))
        // .build();

        // //Gắn refresh token vào cookie
        // response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // return ResponseEntity.ok(new LoginResponse(accessToken));
        // }

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
                                request.identifier(), request.password());

                // xác thực người dùng => cần viết hàm loadUserByUsername trong
                // UserDetailsService
                Authentication authentication = authenticationManagerBuilder.getObject()
                                .authenticate(authenticationToken);

                // set thông tin người dùng đăng nhập vào context (for others to use)
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // response
                ResLoginDTO res = new ResLoginDTO();
                User currentUser = this.userService.fetchUserByEmail(request.identifier());
                if (currentUser != null) {
                        ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(
                                        currentUser.getId(),
                                        currentUser.getEmail(),
                                        currentUser.getUsername());

                        res.setUser(userLogin);
                }
                // create a token
                String access_token = this.jwtUtil.generateAccessToken(request.identifier(), res);
                res.setAccessToken(access_token);

                // generate refresh_token
                String refresh_token = this.jwtUtil.generateRefreshToken(request.identifier(), res);
                this.userService.updateUserToken(refresh_token, request.identifier());

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

        // Get new refresh token when access token outdated
        @GetMapping("/refresh")
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
                if (currentUser != null) {
                        ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(
                                        currentUser.getId(),
                                        currentUser.getEmail(),
                                        currentUser.getUsername());
                        res.setUser(userLogin);
                }

                // create access token
                String access_token = this.jwtUtil.generateAccessToken(email, res);
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
