import { Box } from "./Box";
import { ONTModel } from "./ONTModel";
import { Status } from "./Status";

export class ONT {
    id!: number;
    ontModel!: ONTModel;
    addressId!: number;
    clientId!: number;
    connectedBoxPort!: number;
    status!: Status;
    createdAt!: Date;
    updatedAt!: Date;
    connectedToBox!: Box;
}
