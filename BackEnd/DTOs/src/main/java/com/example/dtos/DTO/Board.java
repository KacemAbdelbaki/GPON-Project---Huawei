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
public class Board {
    Long id;
    long oltId;
    int maxPorts;
    int usedPorts;
    int availablePorts;
}
