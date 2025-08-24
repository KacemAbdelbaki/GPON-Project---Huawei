import { Address } from "../Address";
import { Complaint } from "../Complaint";
import { ONT } from "../Equipment/ONT";
import { Plan } from "../Plan";
import { Role } from "./Role";

export class User {
    id?: number;
    firstname?: string;
    lastname?: string;
    email?: string;
    username?: string;
    password?: string;
    roles?: Set<Role>;
    isExpired?: boolean;
    endExpire?: Date;
    isActive?: boolean;
    phoneNumber?: string;
    address?: Address;
    complaintClient?: Complaint[];
    complaintAgent?: Complaint[];
    plan?: Plan;
    ont?: ONT;
    createdAt?: Date;
    updatedAt?: Date;
}