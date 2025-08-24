package com.example.gpon_equipment_microservice.Entity.Board;

import com.example.gpon_equipment_microservice.Entity.Box.Box;
import com.example.gpon_equipment_microservice.Entity.OLT.OLT;
import com.example.gpon_equipment_microservice.Entity.Status;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

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
public class Board {
    @Id
    @Schema(hidden = true)
    @GeneratedValue
    Long id;
    String boardType; // GPON, XGPON, XGSPON
    int slotNumber;
    @Enumerated(EnumType.STRING)
    Status status;
    int maxPorts;
    int usedPorts;
    int availablePorts;
    @Column(unique = true)
    Long addressId;
    @ManyToOne()
    @JsonIgnore
    OLT olt;
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL)
    List<Box> connectedBoxes;
    @CreationTimestamp
    LocalDateTime createdAt;
    @UpdateTimestamp
    LocalDateTime updatedAt;
}

