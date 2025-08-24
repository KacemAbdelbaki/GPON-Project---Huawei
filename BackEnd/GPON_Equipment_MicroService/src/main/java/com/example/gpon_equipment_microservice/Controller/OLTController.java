package com.example.gpon_equipment_microservice.Controller;

import com.example.gpon_equipment_microservice.Entity.OLT.OLT;
import com.example.gpon_equipment_microservice.Entity.Status;
import com.example.gpon_equipment_microservice.Service.OLT.IOLTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/olt")
public class OLTController {

    @Autowired
    IOLTService oltService;

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody OLT olt) {
        return ResponseEntity.ok().body(oltService.save(olt));
    }

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok().body(oltService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        Optional<OLT> olt = oltService.findById(id);
        if (olt.isPresent()) {
            return ResponseEntity.ok().body(olt.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> findByStatus(@PathVariable Status status) {
        return ResponseEntity.ok().body(oltService.findByStatus(status));
    }

    @GetMapping("/address/{addressId}")
    public ResponseEntity<?> findByAddressId(@PathVariable Long addressId) {
        OLT olt = oltService.findByAddressId(addressId);
        if (olt != null) {
            return ResponseEntity.ok().body(olt);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody OLT olt) {
        Optional<OLT> existingOLT = oltService.findById(id);
        if (existingOLT.isPresent()) {
            olt.setId(id);
            return ResponseEntity.ok().body(oltService.save(olt));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<OLT> existingOLT = oltService.findById(id);
        if (existingOLT.isPresent()) {
            oltService.deleteById(id);
            return ResponseEntity.ok().body("OLT deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}
// @RestController
// @RequestMapping("/api/olt")
// public class OLTController {
//     @Autowired
//     IOLTService oltService;

//     @PostMapping("/add")
//     public ResponseEntity<?> save(@Valid @RequestBody OLT olt) {
//         return ResponseEntity.ok().body(oltService.save(olt));
//     }

//     @GetMapping()
//     public ResponseEntity<?> findAll() {
//         return ResponseEntity.ok().body(oltService.findAll());
//     }
// }