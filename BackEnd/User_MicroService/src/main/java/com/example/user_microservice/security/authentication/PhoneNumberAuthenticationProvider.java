package com.example.user_microservice.security.authentication;

import com.example.user_microservice.Entity.User.User;
import com.example.user_microservice.Repository.UserRepository;
import com.example.user_microservice.Utils.PhoneNumberPasswordAuthenticationToken;
import com.example.user_microservice.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PhoneNumberAuthenticationProvider implements AuthenticationProvider {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public PhoneNumberAuthenticationProvider(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        PhoneNumberPasswordAuthenticationToken token = (PhoneNumberPasswordAuthenticationToken) authentication;
        
        String phoneNumber = token.getPrincipal().toString();
        String password = token.getCredentials().toString();
        
        User user = userRepository.findByPhoneNumber(phoneNumber);
        
        if (user == null) {
            throw new BadCredentialsException("Invalid phone number or password");
        }
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Invalid phone number or password");
        }
        
        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        
        return PhoneNumberPasswordAuthenticationToken.authenticated(
                userDetails, password, userDetails.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return PhoneNumberPasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
