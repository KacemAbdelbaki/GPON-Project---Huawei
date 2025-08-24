import Control from 'ol/control/Control';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Overlay from 'ol/Overlay';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Feature from 'ol/Feature';
import { MapComponent } from './map-component';

export class DeligationControl extends Control {
  private delegationLayer: VectorLayer<VectorSource> | null = null;
  private detailedDelegationLayer: VectorLayer<VectorSource> | null = null;
  private zoomThreshold: number = 10; // Threshold for showing detailed delegations
  private tooltipOverlay: Overlay | null = null;
  private tooltipElement: HTMLElement | null = null;
  private mapComponent: MapComponent;
  private equipmentSummaryEnabled: boolean = false;
  
  constructor(mapComponent?: MapComponent, opt_options?: any) {
    const options = opt_options || {};

    const button = document.createElement('button');
    button.innerHTML = 'D';
    button.title = 'Show delegations and equipment summary';

    const element = document.createElement('div');
    element.className = 'ol-delegation-extent ol-control';
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    this.mapComponent = mapComponent as MapComponent;
    button.addEventListener('click', this.toggleDelegations.bind(this), false);
  }

  toggleDelegations(): void {
    // If already loaded, toggle the visibility and equipment summary mode
    if (this.delegationLayer || this.detailedDelegationLayer) {
      // Get current visibility state of either layer
      const isVisible = (this.delegationLayer && this.delegationLayer.getVisible()) || 
                        (this.detailedDelegationLayer && this.detailedDelegationLayer.getVisible());
      
      // Toggle visibility based on zoom level
      const zoom = this.getMap()!.getView().getZoom()!;
      const showDetailed = zoom >= this.zoomThreshold;
      
      if (this.delegationLayer) {
        this.delegationLayer.setVisible(!isVisible && !showDetailed);
      }
      
      if (this.detailedDelegationLayer) {
        this.detailedDelegationLayer.setVisible(!isVisible && showDetailed);
      }
      
      // Toggle equipment summary mode
      this.equipmentSummaryEnabled = !isVisible;
      
      if (this.equipmentSummaryEnabled) {
        // Show tooltip if enabling
        if (this.tooltipElement) {
          this.tooltipElement.style.display = 'none'; // Initially hide until hover
        }
      } else {
        // Hide tooltip if disabling
        if (this.tooltipElement) {
          this.tooltipElement.style.display = 'none';
        }
      }
    } else {
      // First time loading - create everything
      this.LoadDeligations();
      this.equipmentSummaryEnabled = true;
    }
  }

  displayFeatureInfo = (pixel: number[]): void => {
    const features: any[] = [];
    this.getMap()!.forEachFeatureAtPixel(pixel, (feature: any) => {
      const source = feature.get('source');
      if (source === 'delegation' || source === 'detailed-delegation') {
        features.push(feature);
      }
    });
  };

  LoadDeligations() {
    // Create tooltip element
    this.createTooltip();
    
    // Load the standard delegations first
    this.loadGeoJSONFromFile('./assets/geoJson/TN-delegations.geojson', 'delegation');
    
    // Then load the detailed delegations (won't be visible until zoomed in)
    this.loadGeoJSONFromFile('./assets/geoJson/geoBoundaries-TUN-ADM3_simplified.geojson', 'detailed-delegation');
    
    // Add zoom change listener to toggle layers
    this.getMap()!.getView().on('change:resolution', this.handleZoomChange.bind(this));
  }
  
  private createTooltip(): void {
    // Create tooltip element if it doesn't exist
    if (!this.tooltipElement) {
      this.tooltipElement = document.createElement('div');
      this.tooltipElement.className = 'ol-tooltip';
      this.tooltipElement.style.position = 'absolute';
      this.tooltipElement.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      this.tooltipElement.style.padding = '12px 15px';
      this.tooltipElement.style.borderRadius = '8px';
      this.tooltipElement.style.border = 'none';
      this.tooltipElement.style.fontFamily = 'Arial, sans-serif';
      this.tooltipElement.style.fontSize = '13px';
      this.tooltipElement.style.fontWeight = 'normal';
      this.tooltipElement.style.pointerEvents = 'none';
      this.tooltipElement.style.display = 'none';
      this.tooltipElement.style.zIndex = '1000';
      this.tooltipElement.style.boxShadow = '0 3px 14px rgba(0, 0, 0, 0.2)';
      this.tooltipElement.style.color = '#333';
      this.tooltipElement.style.minWidth = '250px';
      this.tooltipElement.style.maxWidth = '350px';
      this.tooltipElement.style.textAlign = 'left';
      
      // Add tooltip element to the map
      document.body.appendChild(this.tooltipElement);
      
      // Create overlay for the tooltip
      this.tooltipOverlay = new Overlay({
        element: this.tooltipElement,
        offset: [0, -10],
        positioning: 'bottom-center',
        stopEvent: false
      });
      
      this.getMap()!.addOverlay(this.tooltipOverlay);
      
      // Setup event handlers for tooltip
      this.setupTooltipEvents();
    }
  }
  
  private getEquipmentInDelegation(delegationFeature: Feature): { 
    olts: number, 
    boards: number, 
    subBoxes: number, 
    subBoxPortsInfo: { total: number, available: number, percentage: number },
    endBoxes: number, 
    endBoxPortsInfo: { total: number, available: number, percentage: number },
    onts: number 
  } {
    if (!this.mapComponent) {
      return { 
        olts: 0, 
        boards: 0, 
        subBoxes: 0, 
        subBoxPortsInfo: { total: 0, available: 0, percentage: 0 },
        endBoxes: 0, 
        endBoxPortsInfo: { total: 0, available: 0, percentage: 0 },
        onts: 0 
      };
    }
    
    const delegationGeometry = delegationFeature.getGeometry();
    
    // Initialize counts
    let oltCount = 0;
    let boardCount = 0;
    let subBoxCount = 0;
    let endBoxCount = 0;
    let ontCount = 0;
    
    // Initialize port counts
    let subBoxTotalPorts = 0;
    let subBoxAvailablePorts = 0;
    let endBoxTotalPorts = 0;
    let endBoxAvailablePorts = 0;
    
    // Count OLTs in this delegation
    if (this.mapComponent.OLTFeatures) {
      oltCount = this.mapComponent.OLTFeatures.filter(olt => {
        const oltGeometry = olt.getGeometry();
        return delegationGeometry && oltGeometry && delegationGeometry.intersectsCoordinate(oltGeometry.getCoordinates());
      }).length;
    }
    
    // Count Boards in this delegation
    if (this.mapComponent.BoardFeatures) {
      boardCount = this.mapComponent.BoardFeatures.filter(board => {
        const boardGeometry = board.getGeometry();
        return delegationGeometry && boardGeometry && delegationGeometry.intersectsCoordinate(boardGeometry.getCoordinates());
      }).length;
    }
    
    // Count SubBoxes in this delegation and check port availability
    if (this.mapComponent.SubBoxFeatures) {
      const subBoxesInDelegation = this.mapComponent.SubBoxFeatures.filter(subBox => {
        const subBoxGeometry = subBox.getGeometry();
        return delegationGeometry && subBoxGeometry && delegationGeometry.intersectsCoordinate(subBoxGeometry.getCoordinates());
      });
      
      subBoxCount = subBoxesInDelegation.length;
      
      // Count ports in SubBoxes
      subBoxesInDelegation.forEach(subBox => {
        const props = subBox.getProperties();
        if (props.ports && Array.isArray(props.ports)) {
          subBoxTotalPorts += props.ports.length;
          subBoxAvailablePorts += props.ports.filter((port: any) => port === null).length;
        }
      });
    }
    
    // Count EndBoxes in this delegation and check port availability
    if (this.mapComponent.EndBoxFeatures) {
      const endBoxesInDelegation = this.mapComponent.EndBoxFeatures.filter(endBox => {
        const endBoxGeometry = endBox.getGeometry();
        return delegationGeometry && endBoxGeometry && delegationGeometry.intersectsCoordinate(endBoxGeometry.getCoordinates());
      });
      
      endBoxCount = endBoxesInDelegation.length;
      
      // Count ports in EndBoxes
      endBoxesInDelegation.forEach(endBox => {
        const props = endBox.getProperties();
        if (props.ports && Array.isArray(props.ports)) {
          endBoxTotalPorts += props.ports.length;
          endBoxAvailablePorts += props.ports.filter((port: any) => port === null).length;
        }
      });
    }
    
    // Count ONTs in this delegation
    if (this.mapComponent.ONTFeatures) {
      ontCount = this.mapComponent.ONTFeatures.filter(ont => {
        const ontGeometry = ont.getGeometry();
        return delegationGeometry && ontGeometry && delegationGeometry.intersectsCoordinate(ontGeometry.getCoordinates());
      }).length;
    }
    
    // Calculate port availability percentages
    const subBoxPortPercentage = subBoxTotalPorts > 0 ? Math.round((subBoxAvailablePorts / subBoxTotalPorts) * 100) : 0;
    const endBoxPortPercentage = endBoxTotalPorts > 0 ? Math.round((endBoxAvailablePorts / endBoxTotalPorts) * 100) : 0;
    
    return {
      olts: oltCount,
      boards: boardCount,
      subBoxes: subBoxCount,
      subBoxPortsInfo: { 
        total: subBoxTotalPorts, 
        available: subBoxAvailablePorts, 
        percentage: subBoxPortPercentage 
      },
      endBoxes: endBoxCount,
      endBoxPortsInfo: { 
        total: endBoxTotalPorts, 
        available: endBoxAvailablePorts, 
        percentage: endBoxPortPercentage 
      },
      onts: ontCount
    };
  }
  
  private setupTooltipEvents(): void {
    // Add pointermove event to show/hide tooltip
    this.getMap()!.on('pointermove', (evt: any) => {
      if (evt.dragging || !this.tooltipElement || !this.tooltipOverlay || !this.equipmentSummaryEnabled) {
        return;
      }
      
      const hit = this.getMap()!.hasFeatureAtPixel(evt.pixel, {
        layerFilter: (layer) => {
          return layer === this.delegationLayer || layer === this.detailedDelegationLayer;
        }
      });
      
      if (hit) {
        let delegationName = '';
        let delegationFeature: Feature | null = null;
        
        this.getMap()!.forEachFeatureAtPixel(evt.pixel, (feature: any, layer: any) => {
          if ((layer === this.delegationLayer || layer === this.detailedDelegationLayer) && 
              (feature.get('source') === 'delegation' || feature.get('source') === 'detailed-delegation')) {
            
            delegationFeature = feature;
            // Get the delegation name from properties - match the actual property names in the GeoJSON files
            const properties = feature.getProperties();
            
            // For standard delegations (TN-delegations.geojson)
            if (feature.get('source') === 'delegation') {
              delegationName = properties['del_fr'] || properties['del_ar'] || 'Delegation';
              
              // If we have equipment summary enabled and the MapComponent reference
              if (this.equipmentSummaryEnabled && this.mapComponent) {
                const equipmentCounts = this.getEquipmentInDelegation(feature);
                
                // Create tooltip content with delegation info and equipment counts
                this.tooltipElement!.innerHTML = `
                  <div style="margin-bottom: 10px;">
                    <h3 style="margin: 0 0 8px 0; color: #1890ff; font-size: 16px; border-bottom: 2px solid #e8e8e8; padding-bottom: 8px;">
                      ${properties['del_fr']} <span style="font-size: 14px; color: #666;">(${properties['del_ar']})</span>
                    </h3>
                    <div style="font-size: 14px; margin-bottom: 8px; color: #595959;">
                      <strong>Governorate:</strong> ${properties['gouv_fr']} <span style="color: #8c8c8c;">(${properties['gouv_ar']})</span>
                    </div>
                  </div>
                  
                  <div style="background-color: #f5f5f5; border-radius: 6px; padding: 10px; margin-bottom: 10px;">
                    <div style="font-weight: bold; margin-bottom: 6px; color: #262626; font-size: 14px;">Equipment Summary</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                      <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #52c41a;"></div>
                        <span>OLTs: <strong>${equipmentCounts.olts}</strong></span>
                      </div>
                      <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #1890ff;"></div>
                        <span>Boards: <strong>${equipmentCounts.boards}</strong></span>
                      </div>
                      <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #fa8c16;"></div>
                        <span>SubBoxes: <strong>${equipmentCounts.subBoxes}</strong></span>
                      </div>
                      <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #f5222d;"></div>
                        <span>EndBoxes: <strong>${equipmentCounts.endBoxes}</strong></span>
                      </div>
                      <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #722ed1;"></div>
                        <span>ONTs: <strong>${equipmentCounts.onts}</strong></span>
                      </div>
                      <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #262626;"></div>
                        <span>Total: <strong>${equipmentCounts.olts + equipmentCounts.boards + equipmentCounts.subBoxes + equipmentCounts.endBoxes + equipmentCounts.onts}</strong></span>
                      </div>
                    </div>
                  </div>
                  
                  <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                    <div style="background-color: ${equipmentCounts.subBoxPortsInfo.percentage > 50 ? '#f6ffed' : equipmentCounts.subBoxPortsInfo.percentage > 20 ? '#fff7e6' : '#fff1f0'}; 
                         border-left: 4px solid ${equipmentCounts.subBoxPortsInfo.percentage > 50 ? '#52c41a' : equipmentCounts.subBoxPortsInfo.percentage > 20 ? '#fa8c16' : '#f5222d'}; 
                         padding: 8px; border-radius: 4px;">
                      <div style="font-weight: bold; margin-bottom: 4px;">SubBox Ports</div>
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>${equipmentCounts.subBoxPortsInfo.available}/${equipmentCounts.subBoxPortsInfo.total} available</div>
                        <div style="font-weight: bold; color: ${equipmentCounts.subBoxPortsInfo.percentage > 50 ? '#52c41a' : equipmentCounts.subBoxPortsInfo.percentage > 20 ? '#fa8c16' : '#f5222d'};">
                          ${equipmentCounts.subBoxPortsInfo.percentage}%
                        </div>
                      </div>
                    </div>
                    
                    <div style="background-color: ${equipmentCounts.endBoxPortsInfo.percentage > 50 ? '#f6ffed' : equipmentCounts.endBoxPortsInfo.percentage > 20 ? '#fff7e6' : '#fff1f0'}; 
                         border-left: 4px solid ${equipmentCounts.endBoxPortsInfo.percentage > 50 ? '#52c41a' : equipmentCounts.endBoxPortsInfo.percentage > 20 ? '#fa8c16' : '#f5222d'}; 
                         padding: 8px; border-radius: 4px;">
                      <div style="font-weight: bold; margin-bottom: 4px;">EndBox Ports</div>
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>${equipmentCounts.endBoxPortsInfo.available}/${equipmentCounts.endBoxPortsInfo.total} available</div>
                        <div style="font-weight: bold; color: ${equipmentCounts.endBoxPortsInfo.percentage > 50 ? '#52c41a' : equipmentCounts.endBoxPortsInfo.percentage > 20 ? '#fa8c16' : '#f5222d'};">
                          ${equipmentCounts.endBoxPortsInfo.percentage}%
                        </div>
                      </div>
                    </div>
                  </div>
                `;
                
                this.tooltipElement!.style.display = 'block';
                this.tooltipOverlay!.setPosition(evt.coordinate);
                return; // Exit the loop since we found and processed a delegation
              }
            } 
            // For detailed delegations (geoBoundaries-TUN-ADM3_simplified.geojson)
            else if (feature.get('source') === 'detailed-delegation') {
              delegationName = properties['name'] || properties['NAME'] || properties['shapeName'] || 
                             properties['ADM3_EN'] || properties['ADM3_FR'] || properties['ADM3'] || 'Delegation';
              
              // For detailed delegations, also show equipment summary if enabled
              if (this.equipmentSummaryEnabled && this.mapComponent) {
                const equipmentCounts = this.getEquipmentInDelegation(feature);
                
                // Create tooltip content with delegation info and equipment counts
                this.tooltipElement!.innerHTML = `
                  <div style="margin-bottom: 10px;">
                    <h3 style="margin: 0 0 8px 0; color: #1890ff; font-size: 16px; border-bottom: 2px solid #e8e8e8; padding-bottom: 8px;">
                      ${delegationName}
                    </h3>
                  </div>
                  
                  <div style="background-color: #f5f5f5; border-radius: 6px; padding: 10px; margin-bottom: 10px;">
                    <div style="font-weight: bold; margin-bottom: 6px; color: #262626; font-size: 14px;">Equipment Summary</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                      <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #52c41a;"></div>
                        <span>OLTs: <strong>${equipmentCounts.olts}</strong></span>
                      </div>
                      <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #1890ff;"></div>
                        <span>Boards: <strong>${equipmentCounts.boards}</strong></span>
                      </div>
                      <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #fa8c16;"></div>
                        <span>SubBoxes: <strong>${equipmentCounts.subBoxes}</strong></span>
                      </div>
                      <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #f5222d;"></div>
                        <span>EndBoxes: <strong>${equipmentCounts.endBoxes}</strong></span>
                      </div>
                      <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #722ed1;"></div>
                        <span>ONTs: <strong>${equipmentCounts.onts}</strong></span>
                      </div>
                      <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #262626;"></div>
                        <span>Total: <strong>${equipmentCounts.olts + equipmentCounts.boards + equipmentCounts.subBoxes + equipmentCounts.endBoxes + equipmentCounts.onts}</strong></span>
                      </div>
                    </div>
                  </div>
                  
                  <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                    <div style="background-color: ${equipmentCounts.subBoxPortsInfo.percentage > 50 ? '#f6ffed' : equipmentCounts.subBoxPortsInfo.percentage > 20 ? '#fff7e6' : '#fff1f0'}; 
                         border-left: 4px solid ${equipmentCounts.subBoxPortsInfo.percentage > 50 ? '#52c41a' : equipmentCounts.subBoxPortsInfo.percentage > 20 ? '#fa8c16' : '#f5222d'}; 
                         padding: 8px; border-radius: 4px;">
                      <div style="font-weight: bold; margin-bottom: 4px;">SubBox Ports</div>
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>${equipmentCounts.subBoxPortsInfo.available}/${equipmentCounts.subBoxPortsInfo.total} available</div>
                        <div style="font-weight: bold; color: ${equipmentCounts.subBoxPortsInfo.percentage > 50 ? '#52c41a' : equipmentCounts.subBoxPortsInfo.percentage > 20 ? '#fa8c16' : '#f5222d'};">
                          ${equipmentCounts.subBoxPortsInfo.percentage}%
                        </div>
                      </div>
                    </div>
                    
                    <div style="background-color: ${equipmentCounts.endBoxPortsInfo.percentage > 50 ? '#f6ffed' : equipmentCounts.endBoxPortsInfo.percentage > 20 ? '#fff7e6' : '#fff1f0'}; 
                         border-left: 4px solid ${equipmentCounts.endBoxPortsInfo.percentage > 50 ? '#52c41a' : equipmentCounts.endBoxPortsInfo.percentage > 20 ? '#fa8c16' : '#f5222d'}; 
                         padding: 8px; border-radius: 4px;">
                      <div style="font-weight: bold; margin-bottom: 4px;">EndBox Ports</div>
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>${equipmentCounts.endBoxPortsInfo.available}/${equipmentCounts.endBoxPortsInfo.total} available</div>
                        <div style="font-weight: bold; color: ${equipmentCounts.endBoxPortsInfo.percentage > 50 ? '#52c41a' : equipmentCounts.endBoxPortsInfo.percentage > 20 ? '#fa8c16' : '#f5222d'};">
                          ${equipmentCounts.endBoxPortsInfo.percentage}%
                        </div>
                      </div>
                    </div>
                  </div>
                `;
                
                this.tooltipElement!.style.display = 'block';
                this.tooltipOverlay!.setPosition(evt.coordinate);
                return; // Exit the loop since we found and processed a delegation
              }
            }
          }
        });
        
        // If equipment summary is not enabled, show the basic tooltip with delegation name only
        if (!this.equipmentSummaryEnabled && delegationName) {
          this.tooltipElement!.innerHTML = delegationName;
          this.tooltipElement!.style.display = 'block';
          this.tooltipOverlay!.setPosition(evt.coordinate);
        }
      } else {
        this.tooltipElement!.style.display = 'none';
      }
    });
    
    // Hide tooltip when mouse leaves the map
    this.getMap()!.getViewport().addEventListener('mouseout', () => {
      if (this.tooltipElement) {
        this.tooltipElement.style.display = 'none';
      }
    });
  }
  
  private handleZoomChange(): void {
    const zoom = this.getMap()!.getView().getZoom();
    
    if (zoom !== undefined && this.equipmentSummaryEnabled) {
      if (zoom >= this.zoomThreshold) {
        // Show detailed delegations when zoomed in
        if (this.delegationLayer) {
          this.delegationLayer.setVisible(false);
        }
        if (this.detailedDelegationLayer) {
          this.detailedDelegationLayer.setVisible(true);
        }
      } else {
        // Show standard delegations when zoomed out
        if (this.delegationLayer) {
          this.delegationLayer.setVisible(true);
        }
        if (this.detailedDelegationLayer) {
          this.detailedDelegationLayer.setVisible(false);
        }
      }
    }
  }

  private loadGeoJSONFromFile(url: string, sourceType: 'delegation' | 'detailed-delegation'): void {
    console.log(`Loading ${sourceType} GeoJSON from ${url}`);
    
    // Create style for delegations
    const delegationStyle = new Style({
      stroke: new Stroke({
        // Different border colors based on delegation type
        color: sourceType === 'delegation' ? 'rgba(0, 100, 180, 0.8)' : 'rgba(255, 0, 242, 0.8)', 
        width: sourceType === 'delegation' ? 1 : 2.5,
      }),
      fill: new Fill({
        color: 'rgba(0, 100, 180, 0.1)',
      }),
    });
    
    const vectorSource = new VectorSource({
      url: url,
      format: new GeoJSON()
    });

    // Add error handling
    vectorSource.on('error', (error) => {
      console.error(`Error loading ${sourceType} GeoJSON:`, error);
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: delegationStyle,
      visible: sourceType === 'delegation', // Only show standard delegations by default
      zIndex: 1 // Keep delegations below equipment
    });
    
    // Store reference to the layer for later toggling
    if (sourceType === 'delegation') {
      // Remove existing delegation layer if it exists
      if (this.delegationLayer) {
        this.getMap()!.removeLayer(this.delegationLayer);
      }
      this.delegationLayer = vectorLayer;
    } else {
      // Remove existing detailed delegation layer if it exists
      if (this.detailedDelegationLayer) {
        this.getMap()!.removeLayer(this.detailedDelegationLayer);
      }
      this.detailedDelegationLayer = vectorLayer;
    }

    this.getMap()!.addLayer(vectorLayer);

    vectorSource.once('change', () => {
      if (vectorSource.getState() === 'ready') {
        const features = vectorSource.getFeatures();
        console.log(`Loaded ${features.length} ${sourceType} features`);
        
        features.forEach(feature => {
          feature.set('source', sourceType);
        });

        if (sourceType === 'delegation' && features.length > 0) {
          const extent = vectorSource.getExtent();
          this.getMap()!.getView().fit(extent, { padding: [20, 20, 20, 20] });
        }
      }
    });
  }
}
