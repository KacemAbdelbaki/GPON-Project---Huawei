import { Role } from "./Role";

export class SigninResponse {
    token!: string;
    type: string = "Bearer";
    id!: number;
    username!: string;
    email!: string;
    roles!: Role[];
    refreshToken!: string;
}