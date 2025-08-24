import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM.js';
import { fromLonLat, toLonLat } from 'ol/proj';
import DragAndDrop from 'ol/interaction/DragAndDrop';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GPX from 'ol/format/GPX';
import GeoJSON from 'ol/format/GeoJSON';
import IGC from 'ol/format/IGC';
import KML from 'ol/format/KML';
import TopoJSON from 'ol/format/TopoJSON';
import { toStringHDMS } from 'ol/coordinate';
import Overlay from 'ol/Overlay';
import Style from 'ol/style/Style';
import { defaults as defaultControls } from 'ol/control/defaults.js';
import Control from 'ol/control/Control';
import Icon from 'ol/style/Icon';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { LineString } from 'ol/geom';
import { BoxService } from '../../../Services/Equipment/Box/box-service';
import { OLTService } from '../../../Services/Equipment/OLT/olt-service';
import { ONTService } from '../../../Services/Equipment/ONT/ont-service';
import { AddressService } from '../../../Services/Address/address-service';
import { EquipmentControl } from './equipment-control';
import { BoardService } from '../../../Services/Equipment/Board/board-service';
import { DeligationControl } from './delegation-control';

@Component({
  selector: 'app-map-component',
  imports: [],
  templateUrl: './map-component.html',
  styleUrl: './map-component.css',
  encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnInit {

  map!: Map;
  overlay!: Overlay;
  container!: HTMLElement;
  content!: HTMLElement;
  closer!: HTMLElement;
  vectorLayer!: VectorLayer<VectorSource>;
  links: Feature[] = [];
  OLTFeatures?: any[] = [];
  BoardFeatures?: any[] = [];
  SubBoxFeatures?: any[] = [];
  EndBoxFeatures?: any[] = [];
  ONTFeatures?: any[] = [];
  allFeatures?: any[] = [];
  chains: any[] = [];

  constructor(
    private boxService: BoxService,
    private oltService: OLTService,
    private boardService: BoardService,
    private ontService: ONTService,
    private addressService: AddressService
  ) { }
  OLTStyle = new Style({
    image: new Icon({
      anchor: [0.5, 1],
      src: 'assets/template/assets/img/equipment/olt/olt-Black.png',
      scale: 0.1,
    }),
  });
  ONTStyle = new Style({
    image: new Icon({
      anchor: [0.5, 1],
      src: 'assets/template/assets/img/equipment/ont/ont-Black.png',
      scale: 0.1,
    }),
  });
  BoardStyle = new Style({
    image: new Icon({
      anchor: [0.5, 1],
      src: 'assets/template/assets/img/equipment/board/board-Black.png',
      scale: 0.1,
    }),
  });
  SubBoxStyle = new Style({
    image: new Icon({
      anchor: [0.5, 1],
      src: 'assets/template/assets/img/equipment/subbox/subbox-Black.png',
      scale: 0.1,
    }),
  });
  EndBoxStyle = new Style({
    image: new Icon({
      anchor: [0.5, 1],
      src: 'assets/template/assets/img/equipment/subbox/subbox-Red.png',
      scale: 0.1,
    }),
  });

  // // Default style for links
  // LinkStyle = new Style({
  //   stroke: new Stroke({
  //     color: 'rgba(128, 128, 128, 0.7)',
  //     width: 1.5
  //   })
  // });


  ngOnInit() {
    this.Map();
  }

  Map(): void {
    this.container = document.getElementById('popup') as HTMLElement;
    this.content = document.getElementById('popup-content') as HTMLElement;
    this.closer = document.getElementById('popup-closer') as HTMLElement;

    this.overlay = new Overlay({
      element: this.container,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });

    this.map = new Map({
      target: 'map',
      controls: defaultControls().extend([
        new DeligationControl(this),
        new EquipmentControl({}, this.boxService, this.oltService, this.boardService, this.ontService, this, this.addressService),
      ]),
      overlays: [this.overlay],
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

    // testing the drag and drop functionality
    const extractStyles = document.getElementById('extractstyles') as HTMLInputElement;
    let dragAndDropInteraction: DragAndDrop;

    const setInteraction = (): void => {
      if (dragAndDropInteraction) {
        this.map.removeInteraction(dragAndDropInteraction);
      }
      dragAndDropInteraction = new DragAndDrop({
        formatConstructors: [
          new GPX(),
          new GeoJSON(),
          new IGC(),
          new KML({ extractStyles: extractStyles?.checked || false }),
          new TopoJSON(),
        ],
      });

      const olts: any[] = [];
      const boards: any[] = [];
      const subBoxes: any[] = [];
      const endBoxes: any[] = [];
      const onts: any[] = [];

      dragAndDropInteraction.on('addfeatures', (event: any) => {
        event.features.forEach((feature: any) => {
          feature.set('source', 'drag-drop');
          switch (feature.getProperties().type) {
            case 'OLT':
              feature.setStyle(this.OLTStyle);
              olts.push(feature);
              break;
            case 'BOARD':
              feature.setStyle(this.BoardStyle);
              boards.push(feature);
              break;
            case 'SUB_BOX':
              feature.setStyle(this.SubBoxStyle);
              subBoxes.push(feature);
              break;
            case 'END_BOX':
              feature.setStyle(this.EndBoxStyle);
              endBoxes.push(feature);
              break;
            case 'ONT':
              feature.setStyle(this.ONTStyle);
              onts.push(feature);
              break;
          }
        });

        this.OLTFeatures = event.features.filter((feature: any) => feature.getProperties().type === 'OLT');
        this.BoardFeatures = event.features.filter((feature: any) => feature.getProperties().type === 'BOARD');
        this.SubBoxFeatures = event.features.filter((feature: any) => feature.getProperties().type === 'SUB_BOX');
        this.EndBoxFeatures = event.features.filter((feature: any) => feature.getProperties().type === 'END_BOX');
        this.ONTFeatures = event.features.filter((feature: any) => feature.getProperties().type === 'ONT');
        this.allFeatures = [
          ...(this.OLTFeatures || []),
          ...(this.BoardFeatures || []),
          ...(this.SubBoxFeatures || []),
          ...(this.EndBoxFeatures || []),
          ...(this.ONTFeatures || []),
          ...this.links
        ];
        this.chains = [];

        // start chain extraction
        if (this.OLTFeatures) {
          this.OLTFeatures.forEach((olt) => {
            const oltProps = olt.getProperties();
            console.log('OLT:', oltProps.id);
            oltProps["boardSlots"].forEach((slot: any) => {
              const oltBoards = this.BoardFeatures?.filter((board: any) => {
                return board.getProperties().id === slot;
              });
              oltBoards?.forEach((board: any) => {
                const boardProps = board.getProperties();

                //directly connect subBoxes to Board
                boardProps["connectedSubBoxes"]?.forEach((subBoxId: number) => {
                  const BoardSubBoxes = this.SubBoxFeatures?.filter((subBox: any) => {
                    return subBox.getProperties().id === subBoxId;
                  });
                  BoardSubBoxes?.forEach((subBox: any) => {
                    let subBoxProps = subBox.getProperties();
                    let subBoxChain: any[] = [subBox];
                    let currentSubBoxProps = subBoxProps;

                    while (currentSubBoxProps["connectedToNextBoxId"]) {
                      const nextSubBox = this.SubBoxFeatures?.find((next: any) =>
                        next.getProperties().id === currentSubBoxProps["connectedToNextBoxId"]);

                      if (nextSubBox) {
                        subBoxChain.push(nextSubBox);
                        currentSubBoxProps = nextSubBox.getProperties();
                      } else {
                        break;
                      }
                    }
                    let endBox = null;
                    let onts: any[] = [];

                    // Find ONTs connected to the current SubBox
                    const subBoxOnts = this.ONTFeatures?.filter((ont: any) => {
                      const ontProps = ont.getProperties();
                      return ontProps.connectedTo &&
                        ontProps.connectedTo === currentSubBoxProps.id;
                    }) || [];

                    // Add these to our onts array
                    onts = [...subBoxOnts];

                    // Check for connected EndBox and its ONTs
                    if (currentSubBoxProps["connectedToNextBoxId"]) {
                      endBox = this.EndBoxFeatures?.find((endbox: any) =>
                        endbox.getProperties().id === currentSubBoxProps["connectedToNextBoxId"]);
                      if (endBox) {
                        const endBoxProps = endBox.getProperties();
                        const endBoxOnts = this.ONTFeatures?.filter((ont: any) => {
                          const ontProps = ont.getProperties();
                          return ontProps.connectedTo &&
                            ontProps.connectedTo === endBoxProps.id;
                        }) || [];

                        // Add EndBox ONTs to our onts array
                        onts = [...onts, ...endBoxOnts];
                      }
                    }

                    // Create a chain entry with all components
                    this.chains.push({
                      olt: oltProps,
                      board: boardProps,
                      subBoxChain: subBoxChain,
                      endBox: endBox,
                      onts: onts
                    });
                  });
                });
              });
            });
            console.log(this.chains);
            // console.log("-----------------DEBUGGING-----------------");
            // console.log(this.chains[0].subBoxChain[0]['values_']['geometry']);
            // console.log("-----------------DEBUGGING-----------------");
          });
        }
        //end chain extraction

        // start configure the vector layer with all features
        this.chains.forEach(chain => {
          // Create link between OLT and first SubBox
          if (chain.subBoxChain.length > 0) {
            const OLT_SubBox_Link: Feature = new Feature({
              geometry: new LineString([
                chain.olt.geometry.flatCoordinates,
                chain.subBoxChain[0].values_.geometry.flatCoordinates
              ])
            });
            this.links.push(OLT_SubBox_Link);

            // Create links between SubBoxes in the chain
            for (let i = 0; i < chain.subBoxChain.length - 1; i++) {
              const SubBox_SubBox_Link: Feature = new Feature({
                geometry: new LineString([
                  chain.subBoxChain[i].values_.geometry.flatCoordinates,
                  chain.subBoxChain[i + 1].values_.geometry.flatCoordinates
                ])
              });
              this.links.push(SubBox_SubBox_Link);
            }

            // Create link between last SubBox and EndBox if it exists
            if (chain.endBox) {
              const lastSubBox = chain.subBoxChain[chain.subBoxChain.length - 1];
              const SubBox_EndBox_Link: Feature = new Feature({
                geometry: new LineString([
                  lastSubBox.values_.geometry.flatCoordinates,
                  chain.endBox.values_.geometry.flatCoordinates
                ])
              });
              this.links.push(SubBox_EndBox_Link);
            }

            // Process all ONTs in the chain
            if (chain.onts && chain.onts.length > 0) {
              chain.onts.forEach((ont: any) => {
                const ontProps = ont.getProperties();

                // If ONT is connected to an EndBox
                if (ontProps.connectedTo && chain.endBox && chain.endBox.getProperties().id === ontProps.connectedTo) {
                  const EndBox_ONT_Link: Feature = new Feature({
                    geometry: new LineString([
                      chain.endBox.values_.geometry.flatCoordinates,
                      ont.values_.geometry.flatCoordinates
                    ])
                  });
                  this.links.push(EndBox_ONT_Link);
                }
                // If ONT is connected to a SubBox (find the right SubBox in the chain)
                else if (ontProps.connectedTo) {
                  const connectedSubBox = chain.subBoxChain.find((sb: any) =>
                    sb.getProperties().id === ontProps.connectedTo);

                  if (connectedSubBox) {
                    const SubBox_ONT_Link: Feature = new Feature({
                      geometry: new LineString([
                        connectedSubBox.values_.geometry.flatCoordinates,
                        ont.values_.geometry.flatCoordinates
                      ])
                    });
                    this.links.push(SubBox_ONT_Link);
                  }
                }
              });
            }
          }
        });
        // end configure the vector layer with all features

        const vectorSource = new VectorSource({
          features: this.allFeatures,
        });
        this.vectorLayer = new VectorLayer({
          source: vectorSource,
        });
        this.map.addLayer(
          this.vectorLayer,
        );
        this.map.getView().fit(vectorSource.getExtent());
      });
      this.map.addInteraction(dragAndDropInteraction);
    }
    setInteraction();

    extractStyles?.addEventListener('change', setInteraction);

    // Helper to find a feature at specific coordinates
    // this.findFeatureAtCoordinate = (coordinate: number[]): Feature | undefined => {
    //   const allVisibleFeatures = [
    //     ...(this.OLTFeatures || []),
    //     ...(this.SubBoxFeatures || []),
    //     ...(this.EndBoxFeatures || []),
    //     ...(this.ONTFeatures || [])
    //   ];

    //   return allVisibleFeatures.find(feature => {
    //     const geometry = feature.getGeometry();
    //     if (geometry && geometry.getCoordinates) {
    //       const featureCoords = geometry.getCoordinates();
    //       return featureCoords[0] === coordinate[0] && featureCoords[1] === coordinate[1];
    //     }
    //     return false;
    //   });
    // };


    this.map.on('moveend', (evt: any) => {
      // console.log(this.map.getView().getZoom())
      const zoom = this.map.getView().getZoom();
      if (zoom !== undefined && zoom < 15.5) {
        if (this.vectorLayer) {
          this.map.removeLayer(this.vectorLayer);

          this.allFeatures = [...(this.OLTFeatures || [])];
          const vectorSource = new VectorSource({
            features: this.allFeatures,
          });
          this.vectorLayer = new VectorLayer({
            source: vectorSource,
          });
          this.map.addLayer(this.vectorLayer);
          // console.log('Layer refreshed with OLTs only');
        }
      } else if (zoom !== undefined && zoom >= 15.5) {
        if (this.vectorLayer) {
          this.map.removeLayer(this.vectorLayer);
          const linksToInclude = this.links || [];

          // // Ensure all links have the correct style applied
          // linksToInclude.forEach(link => {
          //   if (!link.getStyle()) {
          //     link.setStyle(this.LinkStyle);
          //   }
          // });

          this.allFeatures = [
            ...(this.OLTFeatures || []),
            ...(this.SubBoxFeatures || []),
            ...(this.EndBoxFeatures || []),
            ...(this.ONTFeatures || []),
            ...linksToInclude
          ];
          const vectorSource = new VectorSource({
            features: this.allFeatures,
          });

          this.vectorLayer = new VectorLayer({
            source: vectorSource,
          });

          this.map.addLayer(this.vectorLayer);
        }
      }
    });
    // end testing the drag and drop functionality

    // start popup functionality
    this.map.on('singleclick', (evt: any) => {
      const coordinate = evt.coordinate;
      const lonLat = toLonLat(coordinate);
      const hdms = toStringHDMS(lonLat);
      const lon = lonLat[0].toFixed(6);
      const lat = lonLat[1].toFixed(6);

      // Check if click is within radius of any SubBox or EndBox
      let isNearEquipment = false;
      let nearestEquipment: any = null;
      let nearestDistance = Infinity;
      const RADIUS = 350;
      
      // Find all equipment (SubBoxes and EndBoxes) within radius
      let equipmentInRange: {equipment: any, distance: number, hasAvailablePorts: boolean}[] = [];

      if (this.SubBoxFeatures && this.SubBoxFeatures.length > 0 && this.EndBoxFeatures && this.EndBoxFeatures.length > 0) {
        // Check SubBoxes within radius
        this.SubBoxFeatures.forEach(subBox => {
          const subBoxCoords = subBox.getGeometry().getCoordinates();
          const dx = coordinate[0] - subBoxCoords[0];
          const dy = coordinate[1] - subBoxCoords[1];
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < RADIUS) {
            // Check if this SubBox has available ports
            const props = subBox.getProperties();
            let hasAvailablePorts = false;
            
            if (props.ports && Array.isArray(props.ports)) {
              hasAvailablePorts = props.ports.some((port: any) => port === null);
            }
            
            equipmentInRange.push({
              equipment: subBox,
              distance: distance,
              hasAvailablePorts: hasAvailablePorts
            });
            
            isNearEquipment = true;
          }
        });
        
        // Check EndBoxes within radius
        this.EndBoxFeatures.forEach(endBox => {
          const endBoxCoords = endBox.getGeometry().getCoordinates();
          const dx = coordinate[0] - endBoxCoords[0];
          const dy = coordinate[1] - endBoxCoords[1];
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < RADIUS) {
            // Check if this EndBox has available ports
            const props = endBox.getProperties();
            let hasAvailablePorts = false;
            
            if (props.ports && Array.isArray(props.ports)) {
              hasAvailablePorts = props.ports.some((port: any) => port === null);
            }
            
            equipmentInRange.push({
              equipment: endBox,
              distance: distance,
              hasAvailablePorts: hasAvailablePorts
            });
            
            isNearEquipment = true;
          }
        });
        
        // Sort equipment by availability first, then by distance
        equipmentInRange.sort((a, b) => {
          // First prioritize equipment with available ports
          if (a.hasAvailablePorts && !b.hasAvailablePorts) return -1;
          if (!a.hasAvailablePorts && b.hasAvailablePorts) return 1;
          
          // If both have same availability status, sort by distance
          return a.distance - b.distance;
        });
        
        // Get the best equipment (closest with available ports, or just closest if none have ports)
        if (equipmentInRange.length > 0) {
          nearestEquipment = equipmentInRange[0].equipment;
          nearestDistance = equipmentInRange[0].distance;
        }
      }

      const headerEl = document.getElementById('header');
      if (headerEl) {
        let html = `
          <div style="margin-bottom: 8px;">
            <strong>Coordinates:</strong>
            <div style="background: #f1f5f9; padding: 8px; border-radius: 4px; font-family: monospace; margin-top: 4px;">
              ${hdms}
            </div>
          </div>
          <div style="display: flex; gap: 12px;">
            <div>
              <strong>Latitude:</strong>
              <div style="color: #0369a1">${lat}</div>
            </div>
            <div>
              <strong>Longitude:</strong>
              <div style="color: #0369a1">${lon}</div>
            </div>
          </div>
        `;

        // Add "No equipment nearby" message if not near any equipment
        if (!isNearEquipment) {
          html += `
            <div style="margin-top: 10px; padding: 8px; background-color: #fff2f0; border-radius: 4px; border-left: 4px solid #ff4d4f;">
              <strong>No Equipment Nearby</strong>
              <div>You are not within 350 meters of any SubBox or EndBox.</div>
            </div>
          `;
        }

        // Add equipment proximity information with port availability
        if (isNearEquipment && nearestEquipment) {
          let type: string = "";
          if (nearestEquipment.getProperties().type === 'END_BOX')
            type = 'EndBox';
          else
            type = 'SubBox';
          const props = nearestEquipment.getProperties();

          // Check port availability (null values are available ports)
          const availablePorts: number[] = [];
          let totalAvailablePorts = 0;

          if (props.ports && Array.isArray(props.ports)) {
            props.ports.forEach((port: any, index: number) => {
              if (port === null) {
                availablePorts.push(index);
                totalAvailablePorts++;
              }
            });
          }

          const availabilityColor = totalAvailablePorts > 0 ? '#52c41a' : '#f5222d';
          const availabilityStatus = totalAvailablePorts > 0 ? 'Available' : 'No Available Ports';
          
          // Get alternative equipment options when current one has no ports
          let alternativesHtml = '';
          if (totalAvailablePorts === 0 && equipmentInRange.length > 1) {
            // Find next equipment with available ports
            const alternativesWithPorts = equipmentInRange.filter(e => 
              e.equipment !== nearestEquipment && e.hasAvailablePorts
            );
            
            if (alternativesWithPorts.length > 0) {
              // Show the closest alternative with available ports
              const nextBest = alternativesWithPorts[0];
              const nextBestProps = nextBest.equipment.getProperties();
              const nextBestType = nextBestProps.type === 'END_BOX' ? 'EndBox' : 'SubBox';
              
              alternativesHtml = `
                <div style="margin-top: 8px; padding: 5px; background-color: #f6ffed; border-radius: 4px; border-left: 4px solid #52c41a;">
                  <strong>Alternative Available Equipment:</strong>
                  <div>${nextBestType} ID: ${nextBestProps.id}</div>
                  <div>Distance: ${nextBest.distance.toFixed(2)} meters</div>
                </div>
              `;
            }
          }

          html += `
            <div style="margin-top: 10px; padding: 8px; background-color: #e6f7ff; border-radius: 4px; border-left: 4px solid #1890ff;">
              <strong>Within 350 Meters of ${type}:</strong>
              <div>ID: ${props.id}</div>
              <div>Status: ${props.status}</div>
              <div>Distance: ${nearestDistance.toFixed(2)} meters</div>
              <div style="margin-top: 5px;">
                <strong style="color: ${availabilityColor}">Port Availability: ${availabilityStatus}</strong>
                <div>Available Ports: ${totalAvailablePorts} of ${props.ports ? props.ports.length : 0}</div>
                ${totalAvailablePorts > 0 ? `<div>Available Port Indices: ${availablePorts.join(', ')}</div>` : ''}
              </div>
              ${alternativesHtml}
            </div>
          `;
        }

        headerEl.innerHTML = html;
      }
      this.overlay.setPosition(coordinate);
    });
    this.closer.onclick = () => {
      this.overlay.setPosition(undefined);
      this.closer.blur();
      return false;
    };
  }

  syncDatabase(): void {

  }
}