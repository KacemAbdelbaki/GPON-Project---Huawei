package com.example.user_microservice.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LocationIQResponse {
    @JsonProperty("lat")
    String latitude;
    @JsonProperty("lon")
    String longitude;
    @JsonProperty("display_name")
    String displayAddress;
    @JsonProperty("address")
    AddressDetails address;
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class AddressDetails {
        @JsonProperty("city")
        String city;
        @JsonProperty("town")
        String town;
        @JsonProperty("state")
        String state;
        @JsonProperty("postcode")
        String postCode;
        @JsonProperty("residential")
        String residential;
        @JsonProperty("house_number")
        String houseNumber;
        @JsonProperty("road")
        String road;
    }
}
