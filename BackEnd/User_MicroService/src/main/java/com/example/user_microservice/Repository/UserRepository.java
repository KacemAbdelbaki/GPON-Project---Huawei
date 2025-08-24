package com.example.user_microservice.Repository;

import com.example.user_microservice.Entity.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByPhoneNumber(String phoneNumber);

    // Had to giveup keywords because of incomatible requests being sent using unkown syntax by opengauss/postgres?
//    boolean existsByUsername(@NotBlank(message = "Username is required") @Size(min = 3, max = 20) String username);
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.username = :username")
    boolean existsByUsername(@Param("username") String username);
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.phoneNumber = :phoneNumber")
    boolean existsByPhoneNumber(@Param("phoneNumber") String phoneNumber);
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.email = :email")
    boolean existsByEmail(String email);
    int countByCreatedAtAfter(LocalDateTime createdAt);
}
