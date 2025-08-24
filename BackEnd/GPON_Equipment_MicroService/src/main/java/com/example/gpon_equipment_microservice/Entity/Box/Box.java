package com.example.gpon_equipment_microservice.Entity.Box;

import com.example.gpon_equipment_microservice.Entity.Board.Board;
import com.example.gpon_equipment_microservice.Entity.ONT.ONT;
import com.example.gpon_equipment_microservice.Entity.Status;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "box")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
public class Box {
    @Id
    @GeneratedValue()
    private Long id;
    
    @Enumerated(EnumType.STRING)
    private BoxType type;
    
    private String name;
    private String serialNumber;
    
    @Enumerated(EnumType.STRING)
    private Status status;
    
    private Long addressId;
    
    // Relationships
    @ManyToOne
    @JoinColumn(name = "board_id")
    private Board board;
    
    @ManyToOne
    @JoinColumn(name = "previous_box_id")
    private Box previousBox;
    
    @ManyToOne
    @JoinColumn(name = "next_box_id")
    private Box nextBox;
    
    @OneToMany(mappedBy = "connectedToBox")
    private Set<ONT> onts;
    
    // Additional fields
    private Integer portCapacity;
    private List<Long> ports;
    private Integer usedPorts;
    
    // Helper methods
    public boolean isSubBox() {
        return type == BoxType.SUB_BOX;
    }
    
    public boolean isEndBox() {
        return type == BoxType.END_BOX;
    }
    
    public Integer getAvailablePorts() {
        if (portCapacity == null || usedPorts == null) {
            return null;
        }
        return portCapacity - usedPorts;
    }
    
    /**
     * Helper method to properly set the previous box and maintain bidirectional relationship
     * @param newPreviousBox The box to set as the previous box
     */
    public void setPreviousBoxAndUpdateRelationship(Box newPreviousBox) {
        // Set the new previous box
        this.previousBox = newPreviousBox;
        
        // Update the next box of the new previous box
        if (newPreviousBox != null) {
            newPreviousBox.setNextBox(this);
        }
    }
    
    /**
     * Helper method to properly set the next box and maintain bidirectional relationship
     * @param newNextBox The box to set as the next box
     */
    public void setNextBoxAndUpdateRelationship(Box newNextBox) {
        // Set the new next box
        this.nextBox = newNextBox;
        
        // Update the previous box of the new next box
        if (newNextBox != null) {
            newNextBox.setPreviousBox(this);
        }
    }
}
