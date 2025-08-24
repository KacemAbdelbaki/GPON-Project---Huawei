package com.example.user_microservice.Service.User;

import com.example.user_microservice.Entity.User.User;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface IUserService {

    Boolean existsByUsername(@Param("username") String username);
    Boolean existsByEmail(@Param("email") String email);
    Boolean existsByPhoneNumber(@Param("phoneNumber") String phoneNumber);
    User save(@Param("user") User user);
    User findById(@Param("id") long id);
    int countByCreatedAtAfter(LocalDateTime date);
}
