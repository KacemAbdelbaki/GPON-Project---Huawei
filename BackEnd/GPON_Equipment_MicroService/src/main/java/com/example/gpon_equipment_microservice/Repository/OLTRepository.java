package com.example.gpon_equipment_microservice.Repository;

import com.example.gpon_equipment_microservice.Entity.OLT.OLT;
import com.example.gpon_equipment_microservice.Entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OLTRepository extends JpaRepository<OLT, Long> {
    List<OLT> findByStatus(Status status);
    OLT findByAddressId(Long addressId);
    
    @Query("SELECT o FROM OLT o JOIN o.boardSlots bs WHERE bs = :boardSlotId")
    OLT findByBoardSlotId(@Param("boardSlotId") Long boardSlotId);
}
