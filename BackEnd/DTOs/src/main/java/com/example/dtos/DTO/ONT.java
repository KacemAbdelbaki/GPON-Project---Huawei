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
public class ONT {
    Long id;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    
    // ONT Model reference
    Long ontModelId;
    String ontModelName;
    String ontModelDescription;
    
    // ONT specific information
    String serialNumber;
    String macAddress;
    String ipAddress;
    String firmware;
    String vendor;
    String model;
    Integer numberOfPorts;
    String connectionStatus; // ONLINE, OFFLINE, MAINTENANCE
    String signalStrength;
    String uptime;
    
    // Client reference (ID only for cross-microservice communication)
    Long clientId;
    String clientName;
    
    // Location information
    String country;
    String city;
    String state;
    String residential;
    String postCode;
    Double latitude;
    Double longitude;
    String displayAddress;
    
    // Connection details
    Long oltId;
    String oltConnectionPort;
    Double distanceFromOlt; // in kilometers
}
