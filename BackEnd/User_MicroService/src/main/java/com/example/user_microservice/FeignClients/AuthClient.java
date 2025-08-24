package com.example.user_microservice.FeignClients;

import com.example.user_microservice.security.payload.request.LoginRequest;
import com.example.user_microservice.security.payload.request.SignupRequest;
import jakarta.validation.Valid;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "user-microservice", path = "/gpon/user")
public interface AuthClient {
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest);

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest);

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser();

    @GetMapping("/check-auth")
    public ResponseEntity<?> checkAuth(@CookieValue(name = "auth_token", required = false) String token);
}
