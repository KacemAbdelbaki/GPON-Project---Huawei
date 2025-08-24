import Control from "ol/control/Control";
import { BoxService } from "../../../Services/Equipment/Box/box-service";
import { OLTService } from "../../../Services/Equipment/OLT/olt-service";
import { ONTService } from "../../../Services/Equipment/ONT/ont-service";
import { AddressService } from "../../../Services/Address/address-service";
import { MapComponent } from "./map-component";
import { OLT } from "../../../Core/Models/Equipment/OLT";
import { Box } from "../../../Core/Models/Equipment/Box";
import { ONT } from "../../../Core/Models/Equipment/ONT";
import { Board } from "../../../Core/Models/Equipment/Board";
import { BoardService } from "../../../Services/Equipment/Board/board-service";
import { Status } from "../../../Core/Models/Equipment/Status";
import { BoxType } from "../../../Core/Models/Equipment/BoxType";
import { Address } from "../../../Core/Models/Address";
import { OLTModel } from "../../../Core/Models/Equipment/OLTModel";
import { ONTModel } from "../../../Core/Models/Equipment/ONTModel";

export class EquipmentControl extends Control {
    olts: OLT[] = [];
    boards: Board[] = [];
    boxs: Box[] = [];
    onts: ONT[] = [];

    private oltService: OLTService | null = null;
    private boxService: BoxService | null = null;
    private boardService: BoardService | null = null;
    private ontService: ONTService | null = null;
    private mapComponent: MapComponent | null = null;
    private addressService: AddressService | null = null;

    constructor(
        opt_options?: any,
        boxService?: BoxService,
        oltService?: OLTService,
        boardService?: BoardService,
        ontService?: ONTService,
        mapComponent?: MapComponent,
        addressService?: AddressService
    ) {
        const options = opt_options || {};

        const button = document.createElement('button');
        button.innerHTML = 'S';
        button.title = 'Load/Save Equipment';
        button.addEventListener('click', () => this.loadEquipmentData());

        const element = document.createElement('div');
        element.className = 'ol-equipment-extent ol-control';
        element.appendChild(button);

        super({
            element: element,
            target: options.target,
        });

        this.oltService = oltService || null;
        this.boxService = boxService || null;
        this.boardService = boardService || null;
        this.ontService = ontService || null;
        this.mapComponent = mapComponent || null;
        this.addressService = addressService || null;
    }

    loadEquipmentData() {
        if (this.oltService) {
            this.oltService.findAll().subscribe((olts) => {
                this.olts = olts;
                console.log('OLTs:', this.olts);
            });
        }
    }
}