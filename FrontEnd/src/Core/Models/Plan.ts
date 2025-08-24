import { Client } from "./User/Client";
import { User } from "./User/User";

export class Plan {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    downSpeed?: number;
    upSpeed?: number;
    planStartDate?: Date;
    planEndDate?: Date;
    user?: User;
}
