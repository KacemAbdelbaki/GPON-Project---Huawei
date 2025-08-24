package com.example.gpon_equipment_microservice.Entity.ONT;

import com.example.gpon_equipment_microservice.Entity.Box.Box;
import com.example.gpon_equipment_microservice.Entity.Status;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
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
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
public class ONT {
    @Id
    @Schema(hidden = true)
    @GeneratedValue
    Long id;
    @ManyToOne
    ONTModel ontModel;
    @Column(unique = true)
    Long addressId;
    @Column(unique = true)
    Long clientId;
    Long connectedBoxPort;
    @Enumerated(EnumType.STRING)
    Status status;
    @CreationTimestamp
    LocalDateTime createdAt;
    @UpdateTimestamp
    LocalDateTime updatedAt;
    @ManyToOne
    @JoinColumn(name = "connected_to_box_id")
    Box connectedToBox;
}
