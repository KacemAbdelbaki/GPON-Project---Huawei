package com.example.gpon_equipment_microservice.Controller;

import com.example.gpon_equipment_microservice.Entity.ONT.ONT;
import com.example.gpon_equipment_microservice.Entity.Status;
import com.example.gpon_equipment_microservice.Service.ONT.IONTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ont")
public class ONTController {

    @Autowired
    IONTService ontService;

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody ONT ont) {
        return ResponseEntity.ok().body(ontService.save(ont));
    }

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok().body(ontService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        Optional<ONT> ont = ontService.findById(id);
        if (ont.isPresent()) {
            return ResponseEntity.ok().body(ont.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> findByStatus(@PathVariable Status status) {
        return ResponseEntity.ok().body(ontService.findByStatus(status));
    }

    @GetMapping("/address/{addressId}")
    public ResponseEntity<?> findByAddressId(@PathVariable Long addressId) {
        ONT ont = ontService.findByAddressId(addressId);
        if (ont != null) {
            return ResponseEntity.ok().body(ont);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<?> findByClientId(@PathVariable Long clientId) {
        ONT ont = ontService.findByClientId(clientId);
        if (ont != null) {
            return ResponseEntity.ok().body(ont);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/box/{boxId}")
    public ResponseEntity<?> findByBoxId(@PathVariable Long boxId) {
        return ResponseEntity.ok().body(ontService.findByConnectedToBoxId(boxId));
    }

    @GetMapping("/board/{boardId}")
    public ResponseEntity<?> findByBoardId(@PathVariable Long boardId) {
        return ResponseEntity.ok().body(ontService.findByBoardId(boardId));
    }

    @GetMapping("/olt/{oltId}")
    public ResponseEntity<?> findByOltId(@PathVariable Long oltId) {
        return ResponseEntity.ok().body(ontService.findByOltId(oltId));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody ONT ont) {
        Optional<ONT> existingONT = ontService.findById(id);
        if (existingONT.isPresent()) {
            ont.setId(id);
            return ResponseEntity.ok().body(ontService.save(ont));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<ONT> existingONT = ontService.findById(id);
        if (existingONT.isPresent()) {
            ontService.deleteById(id);
            return ResponseEntity.ok().body("ONT deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}
