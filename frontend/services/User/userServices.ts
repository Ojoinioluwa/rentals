import getUserFromStorage from "@/utils/getUserFromStorage";
import BASE_URL from "@/utils/url";
import axios, { isAxiosError } from "axios";

type User = {
    id: string;
    email: string;
    password: string;
    name: string;
    phoneNumber: string;
    address: string;
    token?: string;
};

type LoginResponse = {
    message: string;
    token: string;
    user: User;
};

type RegisterResponse = {
    message: string;
    user?: User;
};

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
            console.error("LoginAPI Error:", message, error.response?.data);
            throw new Error(message);
        }
        throw new Error("An unexpected error occurred during login");
    }
};

export const RegisterAPI = async ({
    email,
    password,
    name,
    phoneNumber,
    address,
}: Omit<User, "id">): Promise<RegisterResponse> => {
    try {
        const response = await axios.post(
            `${BASE_URL}/auth/register`,
            { email, password, name, phoneNumber, address },
            { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            const message = error.response?.data?.message || "Registration failed";
            console.error("RegisterAPI Error:", message, error.response?.data);
            throw new Error(message);
        }
        throw new Error("An unexpected error occurred during registration");
    }
};

export const GetProfileAPI = async (): Promise<User> => {
    try {
        const user = await getUserFromStorage();
        const token = user?.token;
        if (!token) throw new Error("No user token found");

        const response = await axios.get(`${BASE_URL}/auth/getProfile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            const message = error.response?.data?.message || "Failed to fetch user profile";
            console.error("GetProfileAPI Error:", message, error.response?.data);
            throw new Error(message);
        }
        throw new Error("An unexpected error occurred while fetching profile");
    }
};

export const UpdateProfile = async ({
    email,
    name,
    phoneNumber,
    address,
}: Partial<User>): Promise<User> => {
    try {
        const user = await getUserFromStorage();
        const token = user?.token;
        if (!token) throw new Error("No user token found");

        const response = await axios.put(
            `${BASE_URL}`,
            { email, name, phoneNumber, address },
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
            console.error("UpdateProfile Error:", message, error.response?.data);
            throw new Error(message);
        }
        throw new Error("An unexpected error occurred while updating profile");
    }
};
