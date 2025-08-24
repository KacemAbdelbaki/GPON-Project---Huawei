package com.example.gpon_equipment_microservice.Repository;

import com.example.gpon_equipment_microservice.Entity.ONT.ONT;
import com.example.gpon_equipment_microservice.Entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ONTRepository extends JpaRepository<ONT, Long> {
    List<ONT> findByStatus(Status status);
    ONT findByAddressId(Long addressId);
    ONT findByClientId(Long clientId);
    List<ONT> findByConnectedToBoxId(Long boxId);
    
    @Query("SELECT o FROM ONT o WHERE o.connectedToBox.board.id = :boardId")
    List<ONT> findByBoardId(Long boardId);
    
    @Query("SELECT o FROM ONT o WHERE o.connectedToBox.board.olt.id = :oltId")
    List<ONT> findByOltId(Long oltId);
}
