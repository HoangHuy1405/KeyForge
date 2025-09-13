package Bazaar.com.project.util;

import Bazaar.com.project.dto.AuthDto.ResLoginDTO;
// import io.jsonwebtoken.security.Keys;
// import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Component;

// import javax.crypto.SecretKey;
// import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class JwtUtil {
    @Autowired
    private JwtEncoder jwtEncoder;
    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS256;

    @Value("${jwt.secret}")
    private String secretString;

    @Value("${jwt.access.expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh.expiration}")
    private long refreshTokenExpiration;

    public String generateAccessToken(String email, ResLoginDTO resLoginDTO, List<String> roleNames) {
        Instant now = Instant.now();
        Instant validity = now.plus(this.accessTokenExpiration, ChronoUnit.SECONDS);

        // payload
        // @formatter:off 
        JwtClaimsSet claims = JwtClaimsSet.builder() 
            .issuedAt(now) 
            .expiresAt(validity) 
            .subject(email) 
            .claim("user", resLoginDTO.getUser()) 
            .claim("roles", roleNames)
            .build(); 

        // header
        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build(); 
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }

    public String generateRefreshToken(String email, ResLoginDTO resLoginDTO) {
        Instant now = Instant.now();
        Instant validity = now.plus(this.accessTokenExpiration, ChronoUnit.SECONDS);

        // payload
        // @formatter:off 
        JwtClaimsSet claims = JwtClaimsSet.builder() 
            .issuedAt(now) 
            .expiresAt(validity) 
            .subject(email) 
            .claim("user", resLoginDTO.getUser()) 
            .build(); 

        // header
        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build(); 
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }
}
