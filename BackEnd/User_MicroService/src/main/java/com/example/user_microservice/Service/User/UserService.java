package com.example.user_microservice.Service.User;

import com.example.user_microservice.Entity.User.User;
import com.example.user_microservice.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;

@Service
public class UserService implements IUserService{
    @Autowired
    UserRepository userRepository;


    @Override
    public Boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public Boolean existsByPhoneNumber(String phoneNumber) {
        return userRepository.existsByPhoneNumber(phoneNumber);
    }

    @Override
    public Boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    public User findById(long id) {
        return userRepository.findById(id).get();
    }

    @Override
    public int countByCreatedAtAfter(LocalDateTime date) {
        return userRepository.countByCreatedAtAfter(date);
    }
}
