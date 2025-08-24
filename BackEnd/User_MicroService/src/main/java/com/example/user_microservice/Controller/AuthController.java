package com.example.user_microservice.Controller;

import com.example.user_microservice.Entity.User.Role;
import com.example.user_microservice.Entity.User.User;
import com.example.user_microservice.Service.User.IUserService;
import com.example.user_microservice.Utils.PhoneNumberPasswordAuthenticationToken;
import com.example.user_microservice.security.jwt.JwtUtils;
import com.example.user_microservice.security.payload.request.LoginRequest;
import com.example.user_microservice.security.payload.request.SignupRequest;
import com.example.user_microservice.security.payload.response.JwtResponse;
import com.example.user_microservice.security.payload.response.MessageResponse;
import com.example.user_microservice.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

// dont know what this do, so until then it stays commented
//@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    IUserService userService;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        String jwtRefresh = jwtUtils.generateRefreshToken(authentication);

        String jwtCookie = jwtUtils.jwtTokenCookie(jwt).toString();
        String jwtRefreshTokenCookie = jwtUtils.jwtRefreshTokenCookie(jwtRefresh).toString();

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie)
                .header(HttpHeaders.SET_COOKIE, jwtRefreshTokenCookie)
                .body(new JwtResponse(
//                jwt,
//                jwtRefresh,
                        userDetails.getId(),
                        userDetails.getUsername(),
                        userDetails.getPhoneNumber(),
                        userDetails.getEmail(),
                        roles));
    }

    @PostMapping("/signin-client")
    public ResponseEntity<?> authenticateClient(@Valid @RequestBody LoginRequest loginRequest) {

        log.error(loginRequest.toString());
        Authentication authentication = authenticationManager.authenticate(
                new PhoneNumberPasswordAuthenticationToken(loginRequest.getPhoneNumber(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        String jwtRefresh = jwtUtils.generateRefreshToken(authentication);

        String jwtCookie = jwtUtils.jwtTokenCookie(jwt).toString();
        String jwtRefreshTokenCookie = jwtUtils.jwtRefreshTokenCookie(jwtRefresh).toString();

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie)
                .header(HttpHeaders.SET_COOKIE, jwtRefreshTokenCookie)
                .body(new JwtResponse(
//                jwt,
//                jwtRefresh,
                        userDetails.getId(),
                        userDetails.getUsername(),
                        userDetails.getPhoneNumber(),
                        userDetails.getEmail(),
                        roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        Set<Role> userRoles = new HashSet<>(signUpRequest.getRoles());
        User user = new User();

        if(userRoles.contains(Role.ROLE_AGENT))
        {
            if (userService.existsByUsername(signUpRequest.getUsername())) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Username is already taken!"));
            }
            if (userService.existsByEmail((signUpRequest.getEmail()))) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Email is already in use!"));
            }
            user = new User(signUpRequest.getUsername(), signUpRequest.getEmail(), encoder.encode(signUpRequest.getPassword()));
        } else if (userRoles.contains(Role.ROLE_CLIENT)) {
            if (userService.existsByPhoneNumber(signUpRequest.getPhoneNumber())) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Phone Number is already taken!"));
            }
            user = new User(signUpRequest.getPhoneNumber(), encoder.encode(signUpRequest.getPassword()));
        }
        user.setRoles(userRoles);
        userService.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        String jwtCookie = jwtUtils.killJwtCookie().toString();
        String jwtRefreshTokenCookie = jwtUtils.killjwtRefreshTokenCookie().toString();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie)
                .header(HttpHeaders.SET_COOKIE, jwtRefreshTokenCookie)
                .body("Logout successful");
    }

        @GetMapping("/check-auth")
    public ResponseEntity<?> checkAuth(@CookieValue(name = "auth_token", required = false) String token) {
        if (token == null || !jwtUtils.validateJwtToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Unauthorized"));
        }
        return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("User is authenticated"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable("id") long id) {
        User user = userService.findById(id);
        if (user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("User not found"));
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@Valid @RequestBody User user) {
        return ResponseEntity.status(HttpStatus.OK).body(this.userService.save(user));
    }

    @PostMapping("/count-by-createdAt-after")
    public ResponseEntity<?> countByCreatedAtAfter(@RequestBody @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Map<String ,LocalDateTime> date) {
        return ResponseEntity.status(HttpStatus.OK).body(this.userService.countByCreatedAtAfter(date.get("date")));
    }
}
