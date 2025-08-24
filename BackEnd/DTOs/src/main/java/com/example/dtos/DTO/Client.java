package com.example.dtos.DTO;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Client {
    Long id;
    String firstname;
    String lastname;
    String email;
    String username;
    String password;
    Set<String> roles;
    long addressId;
    Long ontId;
}
