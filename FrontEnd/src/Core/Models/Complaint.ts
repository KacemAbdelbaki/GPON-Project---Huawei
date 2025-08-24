import { Client } from "./User/Client";
import { User } from "./User/User";

export class Complaint {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    complaint?: string;
    userAgent?: User;
    userClient?: User;
}