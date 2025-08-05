package Bazaar.com.project.controller;

import Bazaar.com.project.dto.LoginRequest;
import Bazaar.com.project.dto.RegisterRequest;
import Bazaar.com.project.dto.ResLoginDTO;
import Bazaar.com.project.service.auth.AuthCommandHandler;
import Bazaar.com.project.service.auth.command.CreateUserCommand;
import Bazaar.com.project.util.JwtUtil;
import Bazaar.com.project.util.Annotation.ApiMessage;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private AuthCommandHandler authCommandHandler;
    @Autowired
    private AuthenticationManagerBuilder authenticationManagerBuilder;
    @Autowired
    private PasswordEncoder passwordEncoder;

//     @PostMapping("/login")
//     public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request,
//                                    HttpServletResponse response) {
//         var user = authCommandHandler.handle(
//                 new LoginByUsernameOrEmailCommand(request.identifier(), request.password())
//         );

//         String accessToken = jwtUtil.generateAccessToken(user);
//         String refreshToken = jwtUtil.generateRefreshToken(user);

//         // Gửi refresh token qua cookie
//         ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
//                 .httpOnly(true)
//                 .secure(true)
//                 .sameSite("Strict")
//                 .path("/auth/refresh-token")
//                 .maxAge(Duration.ofDays(7))
//                 .build();

//         //Gắn refresh token vào cookie
//         response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

//         return ResponseEntity.ok(new LoginResponse(accessToken));
//     }

    @PostMapping("/register")
    @ApiMessage("User registered successfully")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request){
        String hashPassword = this.passwordEncoder.encode(request.password());

        var user = this.authCommandHandler.handle(
            new CreateUserCommand(
                    request.username(),
                    hashPassword,
                    request.fullname(),
                    request.email(),
                    request.phoneNum())
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(user);
    }
    
    
    @PostMapping("/login")
    public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody LoginRequest request) {
        //Nạp input gồm username/password vào Security 
        UsernamePasswordAuthenticationToken authenticationToken 
        = new UsernamePasswordAuthenticationToken(request.identifier(), request.password());
        
        //xác thực người dùng => cần viết hàm loadUserByUsername 
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // create a token
        String access_token = this.jwtUtil.generateAccessToken(authentication);
        SecurityContextHolder.getContext().setAuthentication(authentication); // set authentication data to SecurityContext (for others to use - controller, services)

        // response
        ResLoginDTO res = new ResLoginDTO();
        res.setAccessToken(access_token);

        return ResponseEntity.ok().body(res);
    }
}
