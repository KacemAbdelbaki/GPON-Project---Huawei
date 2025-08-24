package com.example.gpon_equipment_microservice.Controller;

import com.example.gpon_equipment_microservice.Entity.Box.Box;
import com.example.gpon_equipment_microservice.Entity.Box.BoxType;
import com.example.gpon_equipment_microservice.Entity.Status;
import com.example.gpon_equipment_microservice.Service.Box.IBoxService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/box")
public class BoxController {

    @Autowired
    IBoxService boxService;

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody Box box) {
        try {
            System.err.println("Attempting to save box: " + (box.getId() != null ? box.getId() : "new box"));
            
            // Handle references to avoid transient object issues
            if (box.getPreviousBox() != null) {
                if (box.getPreviousBox().getId() != null) {
                    System.err.println("Box has previous box with ID: " + box.getPreviousBox().getId());
                } else {
                    System.err.println("Warning: Previous box has no ID, will be ignored");
                }
            }
            
            if (box.getNextBox() != null) {
                if (box.getNextBox().getId() != null) {
                    System.err.println("Box has next box with ID: " + box.getNextBox().getId());
                } else {
                    System.err.println("Warning: Next box has no ID, will be ignored");
                }
            }
            
            Box savedBox = boxService.save(box);
            System.err.println("Box saved successfully with ID: " + savedBox.getId());
            return ResponseEntity.ok().body(savedBox);
        } catch (Exception e) {
            System.err.println("Error saving box: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error saving box: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok().body(boxService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        Optional<Box> box = boxService.findById(id);
        if (box.isPresent()) {
            return ResponseEntity.ok().body(box.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<?> findByType(@PathVariable BoxType type) {
        return ResponseEntity.ok().body(boxService.findByType(type));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> findByStatus(@PathVariable Status status) {
        return ResponseEntity.ok().body(boxService.findByStatus(status));
    }

    @GetMapping("/type/{type}/status/{status}")
    public ResponseEntity<?> findByTypeAndStatus(
            @PathVariable BoxType type,
            @PathVariable Status status) {
        return ResponseEntity.ok().body(boxService.findByTypeAndStatus(type, status));
    }

    @GetMapping("/address/{addressId}")
    public ResponseEntity<?> findByAddressId(@PathVariable Long addressId) {
        Box box = boxService.findByAddressId(addressId);
        if (box != null) {
            return ResponseEntity.ok().body(box);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/previous/{previousBoxId}")
    public ResponseEntity<?> findByPreviousBoxId(@PathVariable Long previousBoxId) {
        return ResponseEntity.ok().body(boxService.findByPreviousBoxId(previousBoxId));
    }
    
    @GetMapping("/next/{nextBoxId}")
    public ResponseEntity<?> findByNextBoxId(@PathVariable Long nextBoxId) {
        return ResponseEntity.ok().body(boxService.findByNextBoxId(nextBoxId));
    }

    @GetMapping("/board/{boardId}")
    public ResponseEntity<?> findByBoardId(@PathVariable Long boardId) {
        return ResponseEntity.ok().body(boxService.findByBoardId(boardId));
    }

    @GetMapping("/olt/{oltId}")
    public ResponseEntity<?> findByOltId(@PathVariable Long oltId) {
        return ResponseEntity.ok().body(boxService.findByOltId(oltId));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Box box) {
        Optional<Box> existingBox = boxService.findById(id);
        if (existingBox.isPresent()) {
            box.setId(id);
            return ResponseEntity.ok().body(boxService.save(box));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<Box> existingBox = boxService.findById(id);
        if (existingBox.isPresent()) {
            boxService.deleteById(id);
            return ResponseEntity.ok().body("Box deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/next")
    public ResponseEntity<?> getNext(@RequestBody Box box) {
        try {
            Optional<Box> dbBox = boxService.findById(box.getId());
            if (dbBox.isPresent() && dbBox.get().getNextBox() != null) {
                return ResponseEntity.ok().body(dbBox.get().getNextBox());
            } else {
                return ResponseEntity.ok().body(box.getNextBox());
            }
        } catch (Exception e) {
            System.err.println("Error in getNext: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok().body("Error: " + e.getMessage());
        }
    }
    
    @PostMapping("/{id}/connect-to-next/{nextBoxId}")
    public ResponseEntity<?> connectToNext(@PathVariable Long id, @PathVariable Long nextBoxId) {
        try {
            Optional<Box> boxOpt = boxService.findById(id);
            Optional<Box> nextBoxOpt = boxService.findById(nextBoxId);
            
            if (boxOpt.isPresent() && nextBoxOpt.isPresent()) {
                Box box = boxOpt.get();
                Box nextBox = nextBoxOpt.get();
                
                // Use the relationship update method
                box.setNextBoxAndUpdateRelationship(nextBox);
                
                // Save both boxes
                Box savedBox = boxService.save(box);
                
                return ResponseEntity.ok().body(savedBox);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error connecting boxes: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error connecting boxes: " + e.getMessage());
        }
    }
    
    @PostMapping("/{id}/connect-to-previous/{previousBoxId}")
    public ResponseEntity<?> connectToPrevious(@PathVariable Long id, @PathVariable Long previousBoxId) {
        try {
            Optional<Box> boxOpt = boxService.findById(id);
            Optional<Box> previousBoxOpt = boxService.findById(previousBoxId);
            
            if (boxOpt.isPresent() && previousBoxOpt.isPresent()) {
                Box box = boxOpt.get();
                Box previousBox = previousBoxOpt.get();
                
                // Use the relationship update method
                box.setPreviousBoxAndUpdateRelationship(previousBox);
                
                // Save both boxes
                Box savedBox = boxService.save(box);
                
                return ResponseEntity.ok().body(savedBox);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error connecting boxes: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error connecting boxes: " + e.getMessage());
        }
    }
}
