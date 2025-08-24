package com.example.gpon_equipment_microservice.Service.OLT;

import com.example.gpon_equipment_microservice.Entity.OLT.OLT;
import com.example.gpon_equipment_microservice.Entity.Status;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IOLTService {
    OLT save(@Param("olt") OLT olt);
    List<OLT> findAll();
    Optional<OLT> findById(Long id);
    List<OLT> findByStatus(Status status);
    OLT findByAddressId(Long addressId);
    OLT findByBoardSlotId(Long boardSlotId);
    void deleteById(Long id);
}
