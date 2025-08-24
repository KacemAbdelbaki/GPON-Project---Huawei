package com.example.user_microservice.Entity;

import com.example.user_microservice.Entity.User.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE)
@Entity
public class Complaint {
    @Id
    @Schema(hidden = true)
    @GeneratedValue
    Long id;
    @CreationTimestamp
    LocalDateTime createdAt;
    @UpdateTimestamp
    LocalDateTime updatedAt;
    String complaint;
    @ManyToOne(cascade = CascadeType.ALL)
    User userAgent;
    @ManyToOne(cascade = CascadeType.ALL)
    User userClient;
}
