package com.example.dtos.DTO;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OLT {
    Long id;
    // OLT Model reference
    Long oltModelId;

    // OLT specific information
    String serialNumber;
    String macAddress;
    String ipAddress;
    String firmware;
    String vendor;
    String model;
//    String status; // ACTIVE, INACTIVE, MAINTENANCE
    
    long addressID;
}
