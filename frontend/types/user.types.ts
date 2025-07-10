import { UserRole } from "@/app/(root)/(auth)/RoleSelection";

export type User = {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    token?: string;
    role: UserRole
};

export type LoginResponse = {
    message: string;
    token: string;
    user: User;
};

export type RegisterResponse = {
    message: string;
    user?: User;
};
export type VerifyResponse = {
    message: string;
    success: boolean;
};

export type VerifyEmail = {
    email: string;
    verificationCode: string;
}