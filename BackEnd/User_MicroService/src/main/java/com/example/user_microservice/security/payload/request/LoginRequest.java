package com.example.user_microservice.security.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class LoginRequest {
//	@NotBlank
  	private String username;
	private String phoneNumber;
	@NotBlank(message = "Password is required")
	private String password;
//	@NotBlank(message = "Email is required")
	private String email;
}
