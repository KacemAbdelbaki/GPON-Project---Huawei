import { Box } from "./Box";
import { OLT } from "./OLT";
import { Status } from "./Status";

export class Board {
    id!: number;
    boardType!: string; // GPON, XGPON, XGSPON
    slotNumber!: number;
    status!: Status;
    maxPorts!: number;
    usedPorts!: number;
    availablePorts!: number;
    addressId!: number;
    olt!: OLT;
    connectedBoxes!: Box[];
    createdAt!: Date;
    updatedAt!: Date;
}
