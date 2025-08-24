package com.example.gpon_equipment_microservice.Service.Box;

import com.example.gpon_equipment_microservice.Entity.Box.Box;
import com.example.gpon_equipment_microservice.Entity.Box.BoxType;
import com.example.gpon_equipment_microservice.Entity.Status;
import com.example.gpon_equipment_microservice.Repository.BoxRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BoxService implements IBoxService {
    
    private final BoxRepository boxRepository;

    @Override
    public Box save(Box box) {
        // Handle the case where we get a complete previousBox object instead of just an ID reference
        if (box.getPreviousBox() != null) {
            Long previousBoxId = box.getPreviousBox().getId();
            if (previousBoxId != null) {
                // Create a new box with just the ID to avoid transient object issues
                Box idOnlyPreviousBox = new Box();
                idOnlyPreviousBox.setId(previousBoxId);
                box.setPreviousBox(idOnlyPreviousBox);
                
                // Now fetch the actual previous box
                Optional<Box> previousBoxOpt = boxRepository.findById(previousBoxId);
                if (previousBoxOpt.isPresent()) {
                    Box previousBox = previousBoxOpt.get();
                    // Set the next box of the previous box to this box
                    previousBox.setNextBox(box);
                    // Save the previous box to update its next box relationship
                    boxRepository.save(previousBox);
                }
            } else {
                // If previousBox has no ID, set it to null to avoid transient object issues
                box.setPreviousBox(null);
            }
        }
        
        // Handle the case where we get a complete nextBox object instead of just an ID reference
        if (box.getNextBox() != null) {
            Long nextBoxId = box.getNextBox().getId();
            if (nextBoxId != null) {
                // Create a new box with just the ID to avoid transient object issues
                Box idOnlyNextBox = new Box();
                idOnlyNextBox.setId(nextBoxId);
                box.setNextBox(idOnlyNextBox);
                
                // Now fetch the actual next box
                Optional<Box> nextBoxOpt = boxRepository.findById(nextBoxId);
                if (nextBoxOpt.isPresent()) {
                    Box nextBox = nextBoxOpt.get();
                    // Set the previous box of the next box to this box
                    nextBox.setPreviousBox(box);
                    // Save the next box to update its previous box relationship
                    boxRepository.save(nextBox);
                }
            } else {
                // If nextBox has no ID, set it to null to avoid transient object issues
                box.setNextBox(null);
            }
        }
        
        // Save this box
        return boxRepository.save(box);
    }

    @Override
    public List<Box> findAll() {
        return boxRepository.findAll();
    }

    @Override
    public Optional<Box> findById(Long id) {
        return boxRepository.findById(id);
    }

    @Override
    public List<Box> findByStatus(Status status) {
        return boxRepository.findByStatus(status);
    }

    @Override
    public List<Box> findByType(BoxType type) {
        return boxRepository.findByType(type);
    }

    @Override
    public Box findByAddressId(Long addressId) {
        return boxRepository.findByAddressId(addressId);
    }

    @Override
    public List<Box> findByPreviousBoxId(Long previousBoxId) {
        return boxRepository.findByPreviousBoxId(previousBoxId);
    }
    
    @Override
    public List<Box> findByNextBoxId(Long nextBoxId) {
        return boxRepository.findByNextBoxId(nextBoxId);
    }

    @Override
    public List<Box> findByBoardId(Long boardId) {
        return boxRepository.findByBoardId(boardId);
    }

    @Override
    public List<Box> findByOltId(Long oltId) {
        return boxRepository.findByBoard_Olt_Id(oltId);
    }

    @Override
    public List<Box> findByTypeAndStatus(BoxType type, Status status) {
        return boxRepository.findByTypeAndStatus(type, status);
    }

    @Override
    public void deleteById(Long id) {
        boxRepository.deleteById(id);
    }
}
