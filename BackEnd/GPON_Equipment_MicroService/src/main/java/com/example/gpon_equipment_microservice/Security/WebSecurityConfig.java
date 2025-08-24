package com.example.gpon_equipment_microservice.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableMethodSecurity
// (securedEnabled = true,
// jsr250Enabled = true,
// prePostEnabled = true) // by default
public class WebSecurityConfig { // extends WebSecurityConfigurerAdapter {

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth ->
                    auth
                            .requestMatchers("/api/olt/**").permitAll()
                            .requestMatchers("/api/ont/**").permitAll()
                            .requestMatchers("/api/box/**").permitAll()
                            .requestMatchers("/api/board/**").permitAll()
                            .requestMatchers("/api/address/**").permitAll()
                            .requestMatchers("/api/test/**").permitAll()
                            .requestMatchers("/actuator/**").permitAll()
                            .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                            .anyRequest().authenticated()
            );
    return http.build();
  }
}