import { Board } from "./Board";
import { OLTModel } from "./OLTModel";
import { Status } from "./Status";

export class OLT {
    id!: number;
    oltModel!: OLTModel;
    boards!: Board[];
    addressId!: number;
    boardSlots!: (number | null)[];
    slotCapacity!: number;
    status!: Status;
    createdAt!: Date;
    updatedAt!: Date;
}
