import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../../shared/navbar/navbar';
import { ONT } from '../../../../Core/Models/Equipment/ONT';
import { ONTModel } from '../../../../Core/Models/Equipment/ONTModel';
import { Status } from '../../../../Core/Models/Equipment/Status';
import { Box } from '../../../../Core/Models/Equipment/Box';
import { ONTService } from '../../../../Services/Equipment/ONT/ont-service';
import { BoxService } from '../../../../Services/Equipment/Box/box-service';
import { AddressService } from '../../../../Services/Address/address-service';
import { Address } from '../../../../Core/Models/Address';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import View from 'ol/View';
import { fromLonLat, toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { defaults as defaultControls } from 'ol/control/defaults.js';
import { Sidebar } from '../../../shared/sidebar/sidebar';

@Component({
  selector: 'app-create-ont',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, Navbar, Sidebar],
  templateUrl: './create-ont.html',
  styleUrl: './create-ont.css',
  encapsulation: ViewEncapsulation.None
})
export class CreateONT implements OnInit {
  map!: Map;
  private vectorLayer?: VectorLayer<VectorSource>;
  ont: ONT = new ONT();
  address: Address = new Address();
  statuses: string[] = Object.values(Status).filter(value => typeof value === 'string');
  boxes: Box[] = [];
  ontModels: ONTModel[] = [];
  clients: any[] = [];
  isLoadingBoxes: boolean = true;
  isLoadingClients: boolean = false;
  selectedBox: Box | null = null;
  availablePorts: number[] = [];
  
  ontForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    ontModelId: new FormControl('', [Validators.required]),
    serialNumber: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    boxId: new FormControl({value: '', disabled: true}, [Validators.required]),
    port: new FormControl({value: '', disabled: true}, [Validators.required, Validators.min(1)]),
    clientId: new FormControl(''),
  });

  constructor(
    private readonly ontService: ONTService,
    private readonly boxService: BoxService,
    private readonly addressService: AddressService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.initMap();
    }, 100);
    this.loadBoxes();
    this.loadONTModels();
    this.loadClients();
  }

  private loadClients(): void {
    this.isLoadingClients = true;
    // Replace with actual client service call when available
    // Simulating client data
    setTimeout(() => {
      this.clients = [
        { id: 1, firstName: 'John', lastName: 'Doe' },
        { id: 2, firstName: 'Jane', lastName: 'Smith' }
      ];
      this.isLoadingClients = false;
    }, 1000);
  }

  private loadBoxes(): void {
    this.isLoadingBoxes = true;
    this.boxService.findAll().subscribe({
      next: (boxes: Box[]) => {
        this.boxes = boxes;
        console.log('Boxes loaded:', this.boxes);
        this.ontForm.get('boxId')?.enable();
        this.isLoadingBoxes = false;
      },
      error: (error: any) => {
        console.error('Error loading boxes:', error);
        this.isLoadingBoxes = false;
      }
    });
  }

  onBoxSelected(): void {
    const boxId = +this.ontForm.get('boxId')?.value;
    this.selectedBox = this.boxes.find(box => box.id === boxId) || null;
    
    if (this.selectedBox) {
      // Enable the port control now that a box is selected
      this.ontForm.get('port')?.enable();
      
      // Generate available ports based on the box's port capacity and used ports
      this.availablePorts = this.getAvailablePortsForBox(this.selectedBox);
    } else {
      this.ontForm.get('port')?.disable();
      this.availablePorts = [];
    }
  }

  private getAvailablePortsForBox(box: Box): number[] {
    const availablePorts: number[] = [];
    
    // If port capacity is not defined, return empty array
    if (!box.portCapacity) {
      return availablePorts;
    }
    
    // Check each port index to see if it's available
    for (let i = 0; i < box.portCapacity; i++) {
      const portNumber = i + 1; // Port numbers are 1-based
      // If ports array exists and the port is null or undefined, it's available
      if (!box.ports || box.ports[i] === null || box.ports[i] === undefined) {
        availablePorts.push(portNumber);
      }
    }
    
    return availablePorts;
  }

  private loadONTModels(): void {
    // Replace with actual ONT models service call when available
    this.ontModels = [
      { id: 1, createdAt: new Date(), updatedAt: new Date(), onts: [] },
      { id: 2, createdAt: new Date(), updatedAt: new Date(), onts: [] }
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

  createONT(): void {
    if (this.ontForm.invalid) {
      Object.keys(this.ontForm.controls).forEach(key => {
        this.ontForm.get(key)?.markAsTouched();
      });
      return;
    }

    // Find the selected ONT model
    const ontModelId = +this.ontForm.get('ontModelId')?.value;
    const selectedONTModel = this.ontModels.find(model => model.id === ontModelId);
    if (!selectedONTModel) {
      console.error('Selected ONT model not found');
      return;
    }
    this.ont.ontModel = selectedONTModel;
    
    // Set custom properties since they're not in the ONT model
    (this.ont as any).name = this.ontForm.get('name')?.value;
    (this.ont as any).serialNumber = this.ontForm.get('serialNumber')?.value;
    this.ont.status = this.ontForm.get('status')?.value;
    
    // Get connected box and port
    const boxId = +this.ontForm.get('boxId')?.value;
    const selectedBox = this.boxes.find(box => box.id === boxId);
    
    if (!selectedBox) {
      console.error('Selected Box not found');
      return;
    }
    
    // Get the port number
    const portNumber = +this.ontForm.get('port')?.value;
    if (!portNumber || portNumber < 1 || portNumber > selectedBox.portCapacity) {
      console.error('Invalid port number');
      return;
    }
    
    this.ont.connectedToBox = selectedBox;
    this.ont.connectedBoxPort = portNumber;

    // Handle optional client ID
    const clientId = this.ontForm.get('clientId')?.value;
    if (clientId) {
      this.ont.clientId = +clientId;
    }

    // First save the address to get an ID
    this.addressService.save(this.address).subscribe(
      (savedAddress: Address) => {
        if (savedAddress.id) {
          this.ont.addressId = savedAddress.id;

          this.ontService.save(this.ont).subscribe(
            (savedONT: ONT) => {
              console.log('ONT created successfully', savedONT);
              
              // Update the box's ports array with the new ONT ID
              if (this.ont.connectedToBox && this.ont.connectedBoxPort) {
                this.updateBoxPort(this.ont.connectedToBox, this.ont.connectedBoxPort, savedONT.id);
              }
              
              this.router.navigate(['/equipment/ont/list']);
            },
            (error: any) => {
              console.error('Error creating ONT', error);
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

  /**
   * Updates the box's ports array to store the ONT ID at the correct port index
   * @param box The box to update
   * @param portNumber The port number (1-based) to update
   * @param ontId The ONT ID to store in the ports array
   */
  private updateBoxPort(box: Box, portNumber: number, ontId: number): void {
    // Ensure the box has a ports array initialized
    if (!box.ports) {
      box.ports = new Array(box.portCapacity).fill(null);
    }
    
    // Update the port (port numbers are 1-based, array indices are 0-based)
    const portIndex = portNumber - 1;
    box.ports[portIndex] = ontId;
    
    // Update the box through the service
    this.boxService.update(box.id, box).subscribe(
      (updatedBox: Box) => {
        console.log('Box ports updated successfully', updatedBox);
      },
      (error: any) => {
        console.error('Error updating box ports', error);
      }
    );
  }
}
