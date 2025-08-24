package com.example.gpon_equipment_microservice.Service.Board;

import com.example.gpon_equipment_microservice.Entity.Board.Board;
import com.example.gpon_equipment_microservice.Entity.Status;
import com.example.gpon_equipment_microservice.Repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BoardService implements IBoardService {
    
    private final BoardRepository boardRepository;

    @Override
    public Board save(Board board) {
        return boardRepository.save(board);
    }

    @Override
    public List<Board> findAll() {
        return boardRepository.findAll();
    }

    @Override
    public Optional<Board> findById(Long id) {
        return boardRepository.findById(id);
    }

    @Override
    public List<Board> findByStatus(Status status) {
        return boardRepository.findByStatus(status);
    }

    @Override
    public List<Board> findByOltId(Long oltId) {
        return boardRepository.findByOltId(oltId);
    }
    
    @Override
    public Board findByOltIdAndSlotNumber(Long oltId, int slotNumber) {
        return boardRepository.findByOlt_IdAndSlotNumber(oltId, slotNumber);
    }
    
    @Override
    public Board findByAddressId(Long addressId) {
        return boardRepository.findByAddressId(addressId);
    }

    @Override
    public void deleteById(Long id) {
        boardRepository.deleteById(id);
    }
}
