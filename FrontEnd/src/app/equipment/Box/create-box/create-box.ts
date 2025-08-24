import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../../shared/navbar/navbar';
import { Box } from '../../../../Core/Models/Equipment/Box';
import { BoxType } from '../../../../Core/Models/Equipment/BoxType';
import { Status } from '../../../../Core/Models/Equipment/Status';
import { Board } from '../../../../Core/Models/Equipment/Board';
import { BoxService } from '../../../../Services/Equipment/Box/box-service';
import { BoardService } from '../../../../Services/Equipment/Board/board-service';
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
  selector: 'app-create-box',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, Navbar, Sidebar],
  templateUrl: './create-box.html',
  styleUrl: './create-box.css',
  encapsulation: ViewEncapsulation.None
})
export class CreateBox implements OnInit {
  map!: Map;
  private vectorLayer?: VectorLayer<VectorSource>;
  box: Box = new Box();
  address: Address = new Address();
  boxTypes: string[] = Object.values(BoxType);
  statuses: string[] = Object.values(Status).filter(value => typeof value === 'string');
  boards: Board[] = [];
  previousBoxes: Box[] = [];
  isLoadingBoards: boolean = true;
  isLoadingPreviousBoxes: boolean = true;

  boxForm: FormGroup = new FormGroup({
    type: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    serialNumber: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    portCapacity: new FormControl('', [Validators.required, Validators.min(1)]),
    boardId: new FormControl({ value: '', disabled: true }),
    previousBoxId: new FormControl({ value: '', disabled: true }),
    nextBoxId: new FormControl({ value: '', disabled: true })
  });

  constructor(
    private readonly boxService: BoxService,
    private readonly boardService: BoardService,
    private readonly addressService: AddressService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.initMap();
    }, 100);
    this.loadBoards();
    this.loadPreviousBoxes();
  }

  private loadBoards(): void {
    this.isLoadingBoards = true;
    this.boardService.findAll().subscribe({
      next: (boards) => {
        this.boards = boards;
        console.log('Boards loaded:', this.boards);
        this.boxForm.get('boardId')?.enable();
        this.isLoadingBoards = false;
      },
      error: (error) => {
        console.error('Error loading boards:', error);
        this.isLoadingBoards = false;
      }
    });
  }

  private loadPreviousBoxes(): void {
    this.isLoadingPreviousBoxes = true;
    this.boxService.findAll().subscribe({
      next: (boxes) => {
        // Process boxes to ensure all properties are properly structured
        this.previousBoxes = boxes.filter(box => typeof box === 'object' && box !== null);
        
        // Log the filtered boxes
        console.log('Previous boxes loaded after filtering:', this.previousBoxes.length);
        
        // Enable form fields
        this.boxForm.get('previousBoxId')?.enable();
        this.boxForm.get('nextBoxId')?.enable();
        this.isLoadingPreviousBoxes = false;
      },
      error: (error) => {
        console.error('Error loading previous boxes:', error);
        this.isLoadingPreviousBoxes = false;
      }
    });
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

  createBox(): void {
    if (this.boxForm.invalid) {
      Object.keys(this.boxForm.controls).forEach(key => {
        this.boxForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.box.type = this.boxForm.get('type')?.value;
    this.box.name = this.boxForm.get('name')?.value;
    this.box.serialNumber = this.boxForm.get('serialNumber')?.value;
    this.box.status = this.boxForm.get('status')?.value;
    this.box.portCapacity = this.boxForm.get('portCapacity')?.value;
    this.box.usedPorts = 0;
    this.box.ports = [];

    const boardId = +this.boxForm.get('boardId')?.value;
    const selectedBoard = this.boards.find(board => board.id === boardId);

    this.box.board = selectedBoard;

    // We don't need to set the previousBox and nextBox properties here anymore
    // We'll use the connect endpoints after saving instead

    this.addressService.save(this.address).subscribe(
      (savedAddress: Address) => {
        if (savedAddress.id) {
          this.box.addressId = savedAddress.id;

          this.boxService.save(this.box).subscribe(
            (savedBox: Box) => {
              console.log('Box created successfully', savedBox);
              
              // Connect to previous box if selected
              if (this.boxForm.get('previousBoxId')?.value) {
                const previousBoxId = +this.boxForm.get('previousBoxId')?.value;
                this.boxService.connectToPrevious(savedBox.id, previousBoxId).subscribe(
                  () => console.log('Connected box to previous box'),
                  (error) => console.error('Error connecting to previous box', error)
                );
              }
              
              // Connect to next box if selected
              if (this.boxForm.get('nextBoxId')?.value) {
                const nextBoxId = +this.boxForm.get('nextBoxId')?.value;
                this.boxService.connectToNext(savedBox.id, nextBoxId).subscribe(
                  () => console.log('Connected box to next box'),
                  (error) => console.error('Error connecting to next box', error)
                );
              }
              
              this.router.navigate(['/equipment/box/list']);
            },
            (error: any) => {
              console.error('Error creating box', error);
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
