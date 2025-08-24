package com.example.user_microservice.security.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class JwtResponse {
//  private String token;
//  private String refreshToken;
//  private String type = "Bearer";
  private Long id;
  private String username;
  private String phoneNumber;
  private String email;
  private List<String> roles;

  public JwtResponse(/**String accessToken, String refreshToken, **/Long id, String username, String phoneNumber, String email, List<String> roles) {
//    this.token = accessToken;
//    this.refreshToken = refreshToken;
    this.id = id;
    this.username = username;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.roles = roles;
  }
}
