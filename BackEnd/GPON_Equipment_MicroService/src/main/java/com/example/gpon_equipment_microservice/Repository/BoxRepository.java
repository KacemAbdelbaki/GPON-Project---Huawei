package com.example.gpon_equipment_microservice.Repository;

import com.example.gpon_equipment_microservice.Entity.Box.Box;
import com.example.gpon_equipment_microservice.Entity.Box.BoxType;
import com.example.gpon_equipment_microservice.Entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoxRepository extends JpaRepository<Box, Long> {
    List<Box> findByStatus(Status status);
    List<Box> findByType(BoxType type);
    Box findByAddressId(Long addressId);
    List<Box> findByPreviousBoxId(Long previousBoxId);
    List<Box> findByNextBoxId(Long nextBoxId);
    List<Box> findByBoardId(Long boardId);
    List<Box> findByBoard_Olt_Id(Long oltId);
    List<Box> findByTypeAndStatus(BoxType type, Status status);
}
