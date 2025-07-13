// services/propertyService.ts
import getUserFromStorage from "@/utils/getUserFromStorage";
import BASE_URL from "@/utils/url";
import axios, { isAxiosError } from "axios";

// Property type (simplified)
type Property = {
    _id?: string;
    title: string;
    description: string;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    toilets: number;
    furnished: boolean;
    price: number;
    billingCycle: string;
    caution?: number;
    features: string[];
    images: string[];
    location: {
        address: string;
        city: string;
        state: string;
        country: string;
    };
    isAvailable?: boolean;
};

const getAuthHeaders = async () => {
    const user = await getUserFromStorage();
    const token = user?.token;
    if (!token) throw new Error("User token not found");
    return { Authorization: `Bearer ${token}` };
};

type MyPropertyQuery = {
    page: number;
    limit: number;
    isAvailable?: boolean;
    propertyType?: string;
    numOfBedroom?: number;
    numOfBathroom?: number;
    numOfToilets?: number;
    isFurnished?: boolean;
};


// Create property
export const createProperty = async (data: FormData) => {
    try {
        const headers = await getAuthHeaders();
        const res = await axios.post(`${BASE_URL}/properties/landlord/create`, data, {
            headers: {
                ...headers,
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error) {
        if (isAxiosError(error)) {
            // console.log(error.response?.data?.message)
            throw new Error(error.response?.data?.message || "Failed to create property");
        }
        // console.error(error)
        throw error;
    }
};

// Get all landlord properties
export const getMyProperties = async ({
    page = 1,
    limit = 10,
    isAvailable,
    propertyType,
    numOfBedroom,
    numOfBathroom,
    numOfToilets,
    isFurnished,
}: MyPropertyQuery) => {
    try {
        const headers = await getAuthHeaders();

        const params = {
            page,
            limit,
            ...(isAvailable !== undefined && { isAvailable: isAvailable }),
            ...(propertyType && { propertyType: propertyType }),
            ...(numOfBedroom && { numOfBedroom: numOfBedroom }),
            ...(numOfBathroom && { numOfBathroom: numOfBathroom }),
            ...(numOfToilets && { numOfToilets: numOfToilets }),
            ...(isFurnished !== undefined && { furnished: isFurnished }),
        };

        const res = await axios.get(`${BASE_URL}/properties/landlord/my`, {
            headers,
            params,
            withCredentials: true, // optional, include if you rely on cookies/sessions
        });

        return res.data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch properties");
        }
        throw error;
    }
};


// Get single property
export const getPropertyById = async (id: string) => {
    try {
        const headers = await getAuthHeaders();
        const res = await axios.get(`${BASE_URL}/properties/landlord/getById/${id}`, { headers });

        return res.data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Property not found");
        }
        // console.log(error)
        throw error;
    }
};

// Update property
export const updateProperty = async ({ id, updates }: { id: string, updates: Partial<Property> }) => {
    try {
        const headers = await getAuthHeaders();
        const res = await axios.patch(`${BASE_URL}/properties/${id}`, updates, { headers });
        return res.data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update property");
        }
        throw error;
    }
};

// Delete property
export const deleteProperty = async (id: string) => {
    try {
        const headers = await getAuthHeaders();
        const res = await axios.delete(`${BASE_URL}/properties/${id}`, { headers });
        return res.data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to delete property");
        }
        throw error;
    }
};

// Toggle property availability
export const toggleAvailability = async (id: string) => {
    try {
        const headers = await getAuthHeaders();
        const res = await axios.patch(`${BASE_URL}/properties/${id}/toggle`, {}, { headers });
        return res.data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to toggle availability");
        }
        throw error;
    }
};

// Upload images
export const uploadPropertyImages = async ({ id, images }: { id: string, images: FormData }) => {
    try {
        const headers = await getAuthHeaders();
        const res = await axios.post(
            `${BASE_URL}/properties/landlord/${id}/upload-images`,
            images,
            {
                headers: {
                    ...headers,
                    "Content-Type": "multipart/form-data",
                }
            }
        );
        return res.data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to upload images");
        }
        throw error;
    }
};
