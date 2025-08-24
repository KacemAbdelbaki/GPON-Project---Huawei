package com.example.user_microservice.Entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
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
public class Address {
    @Id
    @Schema(hidden = true)
    @GeneratedValue
    Long id;
    String city;
    String town;
    String state;
    String postCode;
    double latitude;
    double longitude;
    String displayAddress;
    @CreationTimestamp
    LocalDateTime createdAt;
    @UpdateTimestamp
    LocalDateTime updatedAt;

    public Address(String city, String town, String state, String postCode, double latitude, double longitude, String displayAddress) {
        this.city = city;
        this.town = town;
        this.state = state;
        this.postCode = postCode;
        this.latitude = latitude;
        this.longitude = longitude;
        this.displayAddress = displayAddress;
    }
}
