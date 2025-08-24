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
public class ODN {
    Long id;
    Long ontId;
    long addressId;
    long PlanId;
}
