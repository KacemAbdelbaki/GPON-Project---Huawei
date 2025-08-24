package com.example.gpon_equipment_microservice.Entity.OLT;

import com.example.gpon_equipment_microservice.Entity.Board.Board;
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
public class OLT {
    @Id
    @Schema(hidden = true)
    @GeneratedValue
    Long id;
    @ManyToOne(cascade = CascadeType.ALL)
    OLTModel oltModel;
    @OneToMany(mappedBy = "olt", cascade = CascadeType.ALL)
    List<Board> boards;
    @Column(unique = true)
    Long addressId;
    @ElementCollection
    List<Long> boardSlots;
    Integer slotCapacity;
    @Enumerated(EnumType.STRING)
    Status status;
    @CreationTimestamp
    LocalDateTime createdAt;
    @UpdateTimestamp
    LocalDateTime updatedAt;
}
