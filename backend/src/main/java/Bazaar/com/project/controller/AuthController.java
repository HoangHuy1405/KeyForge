package Bazaar.com.project.controller;

import Bazaar.com.project.dto.LoginRequest;
import Bazaar.com.project.dto.LoginResponse;
import Bazaar.com.project.dto.RegisterRequest;
import Bazaar.com.project.service.auth.AuthCommandHandler;
import Bazaar.com.project.service.auth.command.CreateUserCommand;
import Bazaar.com.project.service.auth.command.LoginByUsernameOrEmailCommand;
import Bazaar.com.project.util.ApiResponse;
import Bazaar.com.project.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private AuthCommandHandler authCommandHandler;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request,
                                   HttpServletResponse response) {
        var user = authCommandHandler.handle(
                new LoginByUsernameOrEmailCommand(request.identifier(), request.password())
        );

        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        // Gửi refresh token qua cookie
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/auth/refresh-token")
                .maxAge(Duration.ofDays(7))
                .build();

        //Gắn refresh token vào cookie
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(new LoginResponse(accessToken));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request){
        var user = this.authCommandHandler.handle(
            new CreateUserCommand(
                    request.username(),
                    request.password(),
                    request.fullname(),
                    request.email(),
                    request.phoneNum())
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(user, "User registered successfully"));
    }

}
