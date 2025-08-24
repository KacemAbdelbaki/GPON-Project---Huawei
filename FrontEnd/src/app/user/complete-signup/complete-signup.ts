import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../../Services/User/user-service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Client } from '../../../Core/Models/User/Client';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM.js';
import { fromLonLat, toLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control/defaults.js';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { AddressService } from '../../../Services/Address/address-service';
import { Navbar } from "../../shared/navbar/navbar";
import { Address } from '../../../Core/Models/Address';

@Component({
  selector: 'app-complete-signup',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, Navbar],
  templateUrl: './complete-signup.html',
  styleUrl: './complete-signup.css',
  encapsulation: ViewEncapsulation.None
})
export class CompleteSignup implements OnInit {
  
  isLoggedIn: boolean = false;
  client: Client = new Client();
  map!: Map;
  private vectorLayer?: VectorLayer<VectorSource>;
  townVisible: boolean = false;
  cityVisible: boolean = true;
  address: Address = new Address();
  completeSignupForm: FormGroup = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    displayAddress: new FormControl('', [Validators.required]),
    city: new FormControl(''),
    town: new FormControl(''),
    state: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required]),
  });

  constructor(
    private readonly addressService: AddressService,
    private readonly userService: UserService,
    private readonly router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.userService.authState$.subscribe(authState => {
      if (!authState.isLoading) {
        this.isLoggedIn = authState.isLoggedIn;
      }
      if (authState.isLoggedIn) {
        this.client = this.userService.getUser();
        if (this.client?.id) {
          this.userService.getUserById(this.client.id).subscribe({
            next: (client) => {
              this.client = client;
              console.log("User data fetched:", this.client);
            }
          });
        }
      }
    });
    
    setTimeout(() => {
      this.Map();
    }, 100);
  }

  private Map(): void {
    this.map = new Map({
      target: 'map',
      controls: defaultControls(),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([9, 34]),
        zoom: 7,
      }),
    });

    this.setupMapEvents();
  }

  private setupMapEvents(): void {
    this.map.on('singleclick', (evt: any) => {
      const coordinate = evt.coordinate;
      const lonLat = toLonLat(coordinate);

      console.log('Clicked coordinates (lon/lat):', lonLat);

      this.addMarker(coordinate);
    });
  }

  private addMarker(coordinate: number[]): void {
    const lonLat = toLonLat(coordinate);
    this.addressService.address(lonLat[1], lonLat[0]).subscribe({
      next: (address) => {
        this.completeSignupForm.controls['city'].setValue(address.city || '');
        this.completeSignupForm.controls['town'].setValue(address.town || '');
        this.completeSignupForm.controls['state'].setValue(address.state || '');
        this.completeSignupForm.controls['postalCode'].setValue(address.postCode || '');
        this.completeSignupForm.controls['displayAddress'].setValue(address.displayAddress || '');
        
        this.address = address;
        this.address.latitude = lonLat[1];
        this.address.longitude = lonLat[0];
        
        if (this.address.town) {
          this.townVisible = true;
          this.cityVisible = false;
        }
        else {
          this.townVisible = false;
          this.cityVisible = true;
        }
        this.cdr.detectChanges();
        console.log('Address details:', this.completeSignupForm.value);
      }
    });

    this.clearPreviousMarker();

    const marker = new Feature({
      type: 'geoMarker',
      geometry: new Point(coordinate),
    });

    const markerStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'assets/template/assets/img/home.png',
        scale: 0.1,
      }),
    });

    this.vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [marker],
      }),
      style: markerStyle,
    });

    this.map.addLayer(this.vectorLayer);
  }

  private clearPreviousMarker(): void {
    if (this.vectorLayer) {
      this.map.removeLayer(this.vectorLayer);
      this.vectorLayer = undefined;
    }
  }

  completeSignup(): void {
    if (this.completeSignupForm.valid) {
      const formData = this.completeSignupForm.value;
      console.log('Form Data:', formData);

      this.client.firstname = formData.firstname;
      this.client.lastname = formData.lastname;
      this.client.email = formData.email;

      this.addressService.save(this.address).subscribe((address) => {
        console.log('Address saved:', address);
        this.client.address = address;
        this.userService.save(this.client).subscribe(() => {
          console.log('User data saved:', this.client)
          this.router.navigate(['/profile']);
        });
      })
    } else {
      console.error('Form is invalid');
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.completeSignupForm.controls).forEach(key => {
      const control = this.completeSignupForm.get(key);
      control?.markAsTouched();
    });
  }
}
