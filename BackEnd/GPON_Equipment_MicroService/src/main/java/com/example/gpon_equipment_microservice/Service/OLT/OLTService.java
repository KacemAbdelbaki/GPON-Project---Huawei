package com.example.gpon_equipment_microservice.Service.OLT;

import com.example.gpon_equipment_microservice.Entity.OLT.OLT;
import com.example.gpon_equipment_microservice.Entity.Status;
import com.example.gpon_equipment_microservice.Repository.OLTRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OLTService implements IOLTService {
    private final OLTRepository oltRepository;

    @Override
    public OLT save(OLT olt) {
        return this.oltRepository.save(olt);
    }

    @Override
    public List<OLT> findAll() {
        return this.oltRepository.findAll();
    }

    @Override
    public Optional<OLT> findById(Long id) {
        return oltRepository.findById(id);
    }

    @Override
    public List<OLT> findByStatus(Status status) {
        return oltRepository.findByStatus(status);
    }

    @Override
    public OLT findByAddressId(Long addressId) {
        return oltRepository.findByAddressId(addressId);
    }

    @Override
    public OLT findByBoardSlotId(Long boardSlotId) {
        return oltRepository.findByBoardSlotId(boardSlotId);
    }

    @Override
    public void deleteById(Long id) {
        oltRepository.deleteById(id);
    }
}
