package com.example.gpon_equipment_microservice.FeignClients;

import com.example.gpon_equipment_microservice.Entity.OLT.OLT;
import jakarta.validation.Valid;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "user-microservice", path = "/gpon/equipment")
public interface OLTCleint {
    @PostMapping("/add")
    public ResponseEntity<?> save(@Valid @RequestBody OLT olt);

    @GetMapping("/olt")
    public ResponseEntity<?> findAll();
}
