import { LoginResponse, RegisterResponse, User, VerifyEmail, VerifyResponse } from "@/types/user.types";
import getUserFromStorage from "@/utils/getUserFromStorage";
import BASE_URL from "@/utils/url";
import axios, { isAxiosError } from "axios";


export const LoginAPI = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}): Promise<LoginResponse> => {
    try {
        const response = await axios.post(
            `${BASE_URL}/auth/login`,
            { email, password },
            { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            const message = error.response?.data?.message || "Login failed";
            // console.error("LoginAPI Error:", message, error.response?.data);
            throw new Error(message);
        }
        throw new Error("An unexpected error occurred during login");
    }
};

export const RegisterAPI = async ({
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    address,
    role
}: Omit<User, "id">): Promise<RegisterResponse> => {
    try {
        const response = await axios.post(
            `${BASE_URL}/auth/register`,
            {
                email, password, firstName,
                lastName, phoneNumber, address, role
            },
            { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            const message = error.response?.data?.message || "Registration failed";
            // console.error("RegisterAPI Error:", message, error.response?.data);
            throw new Error(message);
        }
        throw new Error("An unexpected error occurred during registration");
    }
};

export const GetProfileAPI = async () => {
    try {
        const user = await getUserFromStorage();
        const token = user?.token;
        if (!token) throw new Error("No user token found");

        const response = await axios.get(`${BASE_URL}/getUserProfile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            const message = error.response?.data?.message || "Failed to fetch user profile";
            // console.error("GetProfileAPI Error:", message, error.response?.data);
            throw new Error(message);
        }
        throw new Error("An unexpected error occurred while fetching profile");
    }
};

export const UpdateProfile = async ({
    email,
    firstName,
    lastName,
    phoneNumber,
    address,
}: Partial<User>): Promise<User> => {
    try {
        const user = await getUserFromStorage();
        const token = user?.token;
        if (!token) throw new Error("No user token found");

        const response = await axios.put(
            `${BASE_URL}`,
            {
                email, firstName,
                lastName, phoneNumber, address
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            const message = error.response?.data?.message || "Failed to update profile";
            // console.error("UpdateProfile Error:", message, error.response?.data);
            throw new Error(message);
        }
        throw new Error("An unexpected error occurred while updating profile");
    }
};

export const VerifyEmailAPI = async ({ email, verificationCode }: VerifyEmail): Promise<VerifyResponse> => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/verify-user`, { email, verificationCode })
        return response.data
    } catch (error) {
        if (isAxiosError(error)) {
            const message = error.response?.data?.message || "Failed to Verify user";
            // console.error("VerifyEmailAPI Error:", message, error.response?.data);
            throw new Error(message);
        }
        throw new Error("An unexpected error occurred while Verifying Email");
    }
}
