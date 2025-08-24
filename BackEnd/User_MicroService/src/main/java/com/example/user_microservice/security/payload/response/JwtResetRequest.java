package com.example.user_microservice.security.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class JwtResetRequest {
  private String token;
  private String password;
}
