package com.dietreino.backend.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.dietreino.backend.domain.User;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class TokenService {
    @Value("${api.security.token.secret}")
    private String secret;

    @Getter
    private final Integer timeToExpire = 12;

    @Value("${api.security.token.refresh_secret}")
    private String refreshSecret;


    @Value("${jwt.expiration}")
    private long jwtExpiration;

    @Value("${jwt.refreshExpiration}")
    private long refreshExpiration;

    private final String issuer = "dietreino";

    public String generateAccessToken(User user) {
        return generateToken(user, false);
    }

    public String generateRefreshToken(User user) {
        return generateToken(user, true);
    }

    public String generateToken(User user, Boolean refresh) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(refresh ? refreshSecret : secret);
            return JWT.create()
                    .withIssuer(issuer)
                    .withSubject(user.getEmail())
                    .withClaim("user_id", user.getId().toString())
                    .withExpiresAt(this.generateExpirationDate(refresh))
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("JWT generation failed", exception);
        }
    }

    private DecodedJWT decode(String token, Boolean refresh) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(refresh ? refreshSecret : secret);
            return JWT.require(algorithm)
                    .withIssuer(issuer)
                    .build()
                    .verify(token);
        } catch (JWTVerificationException exception) {
            return null;
        }
    }

    public String validateToken(String token, Boolean refresh) {
        DecodedJWT decoded = decode(token, refresh);
        if (decoded == null) {
            return null;
        }

        return decoded.getSubject();
    }


    public Date getExpirationDate(String token, Boolean refresh) {
        DecodedJWT decoded = decode(token, refresh);
        if (decoded == null) {
            return null;
        }

        return decoded.getExpiresAt();
    }

    private Date generateExpirationDate(Boolean refresh) {
        long expirationTime = refresh ? refreshExpiration : jwtExpiration;
        return new Date(System.currentTimeMillis() + expirationTime);
    }
}
