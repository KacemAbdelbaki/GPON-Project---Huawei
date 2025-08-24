package com.example.gpon_equipment_microservice.Service.Board;

import com.example.gpon_equipment_microservice.Entity.Board.Board;
import com.example.gpon_equipment_microservice.Entity.Status;

import java.util.List;
import java.util.Optional;

public interface IBoardService {
    Board save(Board board);
    List<Board> findAll();
    Optional<Board> findById(Long id);
    List<Board> findByStatus(Status status);
    List<Board> findByOltId(Long oltId);
    Board findByOltIdAndSlotNumber(Long oltId, int slotNumber);
    Board findByAddressId(Long addressId);
    void deleteById(Long id);
}
