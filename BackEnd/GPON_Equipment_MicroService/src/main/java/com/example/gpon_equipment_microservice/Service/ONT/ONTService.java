package com.example.gpon_equipment_microservice.Service.ONT;

import com.example.gpon_equipment_microservice.Entity.ONT.ONT;
import com.example.gpon_equipment_microservice.Entity.Status;
import com.example.gpon_equipment_microservice.Repository.ONTRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ONTService implements IONTService {
    private final ONTRepository ontRepository;

    @Override
    public ONT save(ONT ont) {
        return ontRepository.save(ont);
    }

    @Override
    public List<ONT> findAll() {
        return ontRepository.findAll();
    }

    @Override
    public Optional<ONT> findById(Long id) {
        return ontRepository.findById(id);
    }

    @Override
    public List<ONT> findByStatus(Status status) {
        return ontRepository.findByStatus(status);
    }

    @Override
    public ONT findByAddressId(Long addressId) {
        return ontRepository.findByAddressId(addressId);
    }

    @Override
    public ONT findByClientId(Long clientId) {
        return ontRepository.findByClientId(clientId);
    }

    @Override
    public List<ONT> findByConnectedToBoxId(Long boxId) {
        return ontRepository.findByConnectedToBoxId(boxId);
    }

    @Override
    public List<ONT> findByBoardId(Long boardId) {
        return ontRepository.findByBoardId(boardId);
    }

    @Override
    public List<ONT> findByOltId(Long oltId) {
        return ontRepository.findByOltId(oltId);
    }
    
    @Override
    public void deleteById(Long id) {
        ontRepository.deleteById(id);
    }
}
