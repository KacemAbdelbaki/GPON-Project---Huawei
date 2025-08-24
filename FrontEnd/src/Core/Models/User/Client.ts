import { Address } from "../Address";
import { Complaint } from "../Complaint";
import { ONT } from "../Equipment/ONT";
import { Plan } from "../Plan";
import { Role } from "./Role";

export class Client {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    firstname?: string;
    lastname?: string;
    email?: string;
    phoneNumber?: string;
    username?: string;
    password?: string;
    roles?: Set<Role>;
    address?: Address;
    complaint?: Complaint[];
    plan?: Plan;
    ont?: ONT;
}