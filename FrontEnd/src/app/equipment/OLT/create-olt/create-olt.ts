import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Status } from '../../../../Core/Models/Equipment/Status';
import { OLT } from '../../../../Core/Models/Equipment/OLT';
import { Navbar } from '../../../shared/navbar/navbar';
import { CommonModule } from '@angular/common';
import { OLTService } from '../../../../Services/Equipment/OLT/olt-service';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import { Address } from '../../../../Core/Models/Address';
import { AddressService } from '../../../../Services/Address/address-service';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import View from 'ol/View';
import { fromLonLat, toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { defaults as defaultControls } from 'ol/control/defaults.js';
import { OLTModel } from '../../../../Core/Models/Equipment/OLTModel';
import { Sidebar } from '../../../shared/sidebar/sidebar';


@Component({
  selector: 'app-create-olt',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Navbar, Sidebar],
  templateUrl: './create-olt.html',
  styleUrl: './create-olt.css',
  encapsulation: ViewEncapsulation.None
})
export class CreateOLT implements OnInit {
  map!: Map;
  private vectorLayer?: VectorLayer<VectorSource>;
  townVisible: boolean = false;
  cityVisible: boolean = true;
  address: Address = new Address();
  olt: OLT = new OLT();
  statuses: string[] = Object.values(Status).filter(value => typeof value === 'string');
  oltModels: OLTModel[] = [];
  
  oltForm: FormGroup = new FormGroup({
    oltModelId: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    slotCapacity: new FormControl('', [Validators.required, Validators.min(1)]),
  });

  constructor(
    private readonly addressService: AddressService,
    private readonly oltService: OLTService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.initMap();
    }, 100);
    this.loadOLTModels();
  }

  private loadOLTModels(): void {
    this.oltModels = [
      { id: 1, createdAt: new Date(), updatedAt: new Date()},
      { id: 2, createdAt: new Date(), updatedAt: new Date()}
    ];
  }

  private initMap(): void {
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
    this.address.latitude = lonLat[1];
    this.address.longitude = lonLat[0];

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

  createOLT(): void {
    if (this.oltForm.invalid) {
      Object.keys(this.oltForm.controls).forEach(key => {
        this.oltForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.olt.status = this.oltForm.get('status')?.value;
    this.olt.boards = []; 
    
    // Get slot capacity and initialize boardSlots array
    this.olt.slotCapacity = +this.oltForm.get('slotCapacity')?.value;
    this.olt.boardSlots = new Array(this.olt.slotCapacity).fill(null);
    
    // Find selected OLT model
    const oltModelId = +this.oltForm.get('oltModelId')?.value;
    const selectedOLTModel = this.oltModels.find(model => model.id === oltModelId);
    if (!selectedOLTModel) {
      console.error('Selected OLT model not found');
      return;
    }
    // this.olt.oltModel = selectedOLTModel;

    this.addressService.save(this.address).subscribe(
      (savedAddress: Address) => {
        if (savedAddress.id) {
          this.olt.addressId = savedAddress.id;

          this.oltService.save(this.olt).subscribe(
            (savedOLT: OLT) => {
              console.log('OLT created successfully', savedOLT);
              this.router.navigate(['/equipment/olt/list']);
            },
            (error: any) => {
              console.error('Error creating OLT', error);
            }
          );
        } else {
          console.error('Saved address has no ID');
        }
      },
      (error: any) => {
        console.error('Error saving address', error);
      }
    );
  }
}
