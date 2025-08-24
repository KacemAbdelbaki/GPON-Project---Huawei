import { Role } from "./Role";

export class SignUpRequest {
    username!: string;
    phoneNumber!: string;
    password!: string;
    email!: string;
    roles!: Role[];
}