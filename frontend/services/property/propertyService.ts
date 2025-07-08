// services/publicPropertyService.ts
import BASE_URL from "@/utils/url";
import axios, { isAxiosError } from "axios";

export const getAllProperties = async (queryParams = {}) => {
    try {
        const response = await axios.get(`${BASE_URL}/properties`, {
            params: queryParams,
        });
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch properties");
        }
        throw error;
    }
};

export const getPropertyAllById = async (propertyId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/properties/${propertyId}`);
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch property details");
        }
        throw error;
    }
};
