package com.example.user_microservice.security.jwt;

import com.example.user_microservice.security.services.UserDetailsImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
@Slf4j
public class JwtUtils {
//  private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

  @Value("${app.jwtSecret}")
  private String jwtSecret;

  @Value("${app.jwtExpirationMs}")
  private int jwtExpirationMs;
  @Value("${app.jwtExpirationMs_EXTENDED}")
  private int jwtExpirationMs_EXTENDED;

  public String generateJwtToken(Authentication authentication) {

    UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

    return Jwts.builder()
        .setSubject((userPrincipal.getUsername()))
        .setIssuedAt(new Date())
        .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
        .signWith(key(), SignatureAlgorithm.HS256)
        .compact();
  }

  public String generateRefreshToken(Authentication authentication) {

    UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

    return Jwts.builder()
            .setSubject((userPrincipal.getUsername()))
            .setIssuedAt(new Date())
            .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs_EXTENDED))
            .signWith(key(), SignatureAlgorithm.HS256)
            .compact();
  }
  public String generateResetToken(String userEmail) {
    return Jwts.builder()
            .setSubject(userEmail)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 15))
            .signWith(key(), SignatureAlgorithm.HS256)
            .compact();
  }

  public ResponseCookie jwtTokenCookie(String token) {
    return  ResponseCookie.from("auth_token", token)
            .httpOnly(true)
//            .secure(true)
            .path("/")
            .maxAge(24 * 60 * 60)
            .sameSite("Strict")
            .build();
  }

  public ResponseCookie killJwtCookie(){
    return ResponseCookie.from("auth_token", "")
            .httpOnly(true)
//            .secure(true)
            .path("/")
            .maxAge(0)
            .sameSite("Strict")
            .build();
  }

  public ResponseCookie jwtRefreshTokenCookie(String refreshToken) {
    return  ResponseCookie.from("auth_refresh_token", refreshToken)
            .httpOnly(true)
//            .secure(true)
            .path("/")
            .maxAge(7 * 24 * 60 * 60)
            .sameSite("Strict")
            .build();
  }

  public ResponseCookie killjwtRefreshTokenCookie(){
    return ResponseCookie.from("auth_refresh_token", "")
            .httpOnly(true)
//            .secure(true)
            .path("/")
            .maxAge(0)
            .sameSite("Strict")
            .build();
  }

  private Key key() {
    return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
  }

  public String getUserNameFromJwtToken(String token) {
    return Jwts.parserBuilder().setSigningKey(key()).build()
               .parseClaimsJws(token).getBody().getSubject();
  }

  public boolean validateJwtToken(String authToken) {
    try {
      Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
      return true;
    } catch (MalformedJwtException e) {
      log.error("Invalid JWT token: {}", e.getMessage());
    } catch (ExpiredJwtException e) {
      log.error("JWT token is expired: {}", e.getMessage());
    } catch (UnsupportedJwtException e) {
      log.error("JWT token is unsupported: {}", e.getMessage());
    } catch (IllegalArgumentException e) {
      log.error("JWT claims string is empty: {}", e.getMessage());
    }

    return false;
  }
}
