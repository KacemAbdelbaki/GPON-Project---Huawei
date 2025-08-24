package com.example.user_microservice.Service.Address;

import com.example.user_microservice.Entity.Address;
import com.example.user_microservice.Entity.LocationIQResponse;
import com.example.user_microservice.Repository.AddressRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserter;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Service
@Slf4j
public class AddressService implements IAddressService {
    @Autowired
    AddressRepository addressRepository;

    Address address = new Address();

    @Value("${locationiq.api.key}")
    private String apiKey;

    @Value("${locationiq.api.url}")
    private String apiUrl;

    private final WebClient webClient;

    public AddressService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @Override
    public Address save(Address address) {
        return addressRepository.save(address);
    }

    @Override
    public Address ReverseGeocoding(Double latitude, Double longitude) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("key", apiKey);
        formData.add("lat", String.valueOf(latitude));
        formData.add("lon", String.valueOf(longitude));
        formData.add("format", "json");

        var monoResponse = this.webClient.post()
                .uri(apiUrl)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(LocationIQResponse.class)
                .doOnSuccess(response -> {
                    log.info("LocationIQ reverse geocoding successful for coordinates: {}, {}", latitude, longitude);
                    log.warn(response.toString());
                })
                .doOnError(error -> log.error("Error calling LocationIQ reverse geocoding API: {}", error.getMessage(), error))
                .onErrorMap(WebClientResponseException.class, ex ->
                        new Exception("Failed to reverse geocode coordinates: " + ex.getMessage(), ex))
                .block();
        if (monoResponse != null){
            this.address = new Address(monoResponse.getAddress().getCity(), monoResponse.getAddress().getTown(), monoResponse.getAddress().getState(), monoResponse.getAddress().getPostCode(), Double.parseDouble(monoResponse.getLatitude()), Double.parseDouble(monoResponse.getLongitude()), monoResponse.getDisplayAddress());
        }
        return address;
    }

    @Override
    public Address findById(Long id) {
        return this.addressRepository.findById(id).orElse(null);
    }
}
