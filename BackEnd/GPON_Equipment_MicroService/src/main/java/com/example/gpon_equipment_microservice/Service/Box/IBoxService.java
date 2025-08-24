package com.example.gpon_equipment_microservice.Service.Box;

import com.example.gpon_equipment_microservice.Entity.Box.Box;
import com.example.gpon_equipment_microservice.Entity.Box.BoxType;
import com.example.gpon_equipment_microservice.Entity.Status;

import java.util.List;
import java.util.Optional;

public interface IBoxService {
    Box save(Box box);
    List<Box> findAll();
    Optional<Box> findById(Long id);
    List<Box> findByStatus(Status status);
    List<Box> findByType(BoxType type);
    Box findByAddressId(Long addressId);
    List<Box> findByPreviousBoxId(Long previousBoxId);
    List<Box> findByNextBoxId(Long nextBoxId);
    List<Box> findByBoardId(Long boardId);
    List<Box> findByOltId(Long oltId);
    List<Box> findByTypeAndStatus(BoxType type, Status status);
    void deleteById(Long id);
}
