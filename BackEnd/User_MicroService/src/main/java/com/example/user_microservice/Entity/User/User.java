package com.example.user_microservice.Entity.User;

import com.example.user_microservice.Entity.Address;
import com.example.user_microservice.Entity.Complaint;
import com.example.user_microservice.Entity.Plan;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE)
@Entity
@Table(name = "app_users")
public class User {
    @Id
    @Schema(hidden = true)
    @GeneratedValue
    Long id;
    String firstname;
    String lastname;
    String email;
    String username;
    String phoneNumber;
    String password;
    @Enumerated(EnumType.STRING)
    Set<Role> roles;
    Boolean isExpired;
    LocalDateTime endExpire;
    Boolean isActive;
    @OneToOne(cascade = CascadeType.ALL)
    Address address;
    @OneToMany(mappedBy = "userAgent", cascade = CascadeType.ALL)
    List<Complaint> complaintAgent;
    @OneToMany(mappedBy = "userClient", cascade = CascadeType.ALL)
    List<Complaint> complaintClient;
    @OneToOne(mappedBy = "user")
    Plan plan;
    long ontId;
    @CreationTimestamp
    LocalDateTime createdAt;
    @UpdateTimestamp
    LocalDateTime updatedAt;

    public User(String username, String email, String password){
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public User(String phoneNumber, String password){
        this.phoneNumber = phoneNumber;
        this.password = password;
    }
}
