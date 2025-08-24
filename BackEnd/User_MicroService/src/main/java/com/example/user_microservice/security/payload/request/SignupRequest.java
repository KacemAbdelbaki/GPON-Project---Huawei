package com.example.user_microservice.security.payload.request;

import com.example.user_microservice.Entity.User.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Set;

@Getter
@Setter
@ToString
public class SignupRequest {
//  @NotBlank(message = "Username is required")
//  @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
  private String username;

//  @NotBlank(message = "Phone Number is required")
//  @Size(min = 8, max = 8, message = "Phone Number must be between 8 characters")
  private String phoneNumber;

//  @NotBlank(message = "Email is required")
//  @Size(max = 50, message = "Password must be 50 characters or less")
  @Email
  private String email;

  private Set<Role> roles;

  @NotBlank(message = "Password is required")
  @Size(min = 6, max = 40, message = "Password must be between 6 and 40 characters")
  private String password;
}
