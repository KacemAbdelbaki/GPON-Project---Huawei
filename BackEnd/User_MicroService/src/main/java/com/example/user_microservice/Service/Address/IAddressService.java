package com.example.user_microservice.Service.Address;

import com.example.user_microservice.Entity.Address;
import com.example.user_microservice.Entity.LocationIQResponse;
import com.example.user_microservice.Entity.User.User;
import org.springframework.data.repository.query.Param;
import reactor.core.publisher.Mono;

public interface IAddressService {
    Address save(@Param("address") Address address);
    Address ReverseGeocoding(Double lat, Double lng);
    Address findById(@Param("id") Long id);
}
