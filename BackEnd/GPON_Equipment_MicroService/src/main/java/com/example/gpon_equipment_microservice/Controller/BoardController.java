package com.example.gpon_equipment_microservice.Controller;

import com.example.gpon_equipment_microservice.Entity.Board.Board;
import com.example.gpon_equipment_microservice.Entity.Status;
import com.example.gpon_equipment_microservice.Service.Board.IBoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/board")
public class BoardController {

    @Autowired
    IBoardService boardService;

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody Board board) {
        return ResponseEntity.ok().body(boardService.save(board));
    }

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok().body(boardService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        Optional<Board> board = boardService.findById(id);
        if (board.isPresent()) {
            return ResponseEntity.ok().body(board.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> findByStatus(@PathVariable Status status) {
        return ResponseEntity.ok().body(boardService.findByStatus(status));
    }

    @GetMapping("/olt/{oltId}")
    public ResponseEntity<?> findByOltId(@PathVariable Long oltId) {
        return ResponseEntity.ok().body(boardService.findByOltId(oltId));
    }

    @GetMapping("/olt/{oltId}/slot/{slotNumber}")
    public ResponseEntity<?> findByOltIdAndSlotNumber(
            @PathVariable Long oltId, 
            @PathVariable int slotNumber) {
        Board board = boardService.findByOltIdAndSlotNumber(oltId, slotNumber);
        if (board != null) {
            return ResponseEntity.ok().body(board);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/address/{addressId}")
    public ResponseEntity<?> findByAddressId(@PathVariable Long addressId) {
        Board board = boardService.findByAddressId(addressId);
        if (board != null) {
            return ResponseEntity.ok().body(board);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Board board) {
        Optional<Board> existingBoard = boardService.findById(id);
        if (existingBoard.isPresent()) {
            board.setId(id);
            return ResponseEntity.ok().body(boardService.save(board));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<Board> existingBoard = boardService.findById(id);
        if (existingBoard.isPresent()) {
            boardService.deleteById(id);
            return ResponseEntity.ok().body("Board deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}
