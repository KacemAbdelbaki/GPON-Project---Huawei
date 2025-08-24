package com.example.user_microservice.Controller;

import com.example.user_microservice.Entity.Address;
import com.example.user_microservice.Service.Address.IAddressService;
import com.example.user_microservice.Service.User.IUserService;
import jakarta.ws.rs.QueryParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/address")
public class AddressController {
    @Autowired
    IAddressService addressService;

//    @PostMapping("/reverse-geo-code/{lat}/{lng}")
//        public ResponseEntity<?> ReverseGeocoding(@PathVariable("lat") Double lat, @PathVariable("lng") Double lng) {
//        return ResponseEntity.ok().body(addressService.ReverseGeocoding(lat, lng));
//    }

    @PostMapping("/reverse-geo-code")
    public ResponseEntity<?> ReverseGeocoding(@QueryParam("lat") Double lat, @QueryParam("lng") Double lng) {
        return ResponseEntity.ok().body(addressService.ReverseGeocoding(lat, lng));
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody Address address) {
        return ResponseEntity.ok().body(addressService.save(address));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAddress(@PathVariable Long id){
        Address address = this.addressService.findById(id);
        if(address != null)
            return ResponseEntity.ok().body(address);
        return ResponseEntity.notFound().build();
    }
}
