package com.example.gpon_equipment_microservice.Service.ONT;

import com.example.gpon_equipment_microservice.Entity.ONT.ONT;
import com.example.gpon_equipment_microservice.Entity.Status;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IONTService {
    ONT save(@Param("ont") ONT ont);
    List<ONT> findAll();
    Optional<ONT> findById(Long id);
    List<ONT> findByStatus(Status status);
    ONT findByAddressId(Long addressId);
    ONT findByClientId(Long clientId);
    List<ONT> findByConnectedToBoxId(Long boxId);
    List<ONT> findByBoardId(Long boardId);
    List<ONT> findByOltId(Long oltId);
    void deleteById(Long id);
}
