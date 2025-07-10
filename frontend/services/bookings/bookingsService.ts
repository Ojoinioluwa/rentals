// services/bookingService.ts
import getUserFromStorage from "@/utils/getUserFromStorage";
import BASE_URL from "@/utils/url";
import axios, { isAxiosError } from "axios";

// type BookingStatus = "pending" | "approved" | "rejected" | "cancelled";

type CreateBooking = {
    propertyId: string;
    message: string;
    rentStart: Date;
    rentEnd: Date;
}

export const createBooking = async ({ propertyId, message, rentStart, rentEnd }: CreateBooking) => {
    try {
        const user = await getUserFromStorage();
        const token = user?.token;

        const response = await axios.post(`${BASE_URL}/bookings/${propertyId}`, {
            message,
            rentStart,
            rentEnd
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to create booking");
        }
        throw error;
    }
};

export const getMyBookings = async (status: string, page: number, limit: number) => {
    try {
        const user = await getUserFromStorage();
        const token = user?.token;

        const response = await axios.get(`${BASE_URL}/bookings/me`, {
            params: { status, page, limit },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch your bookings");
        }
        throw error;
    }
};


export const getBooking = async (bookingId: string) => {
    try {
        const user = await getUserFromStorage();
        const token = user?.token;

        const response = await axios.get(`${BASE_URL}/bookings/me/${bookingId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch booking details");
        }
        throw error;
    }
};

export const cancelBooking = async (bookingId: string) => {
    try {
        const user = await getUserFromStorage();
        const token = user?.token;

        const response = await axios.put(`${BASE_URL}/bookings/me/${bookingId}/cancel`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to cancel booking");
        }
        throw error;
    }
};

export const rescheduleBooking = async (bookingId: string, newDateRange: any) => {
    try {
        const user = await getUserFromStorage();
        const token = user?.token;

        const response = await axios.put(`${BASE_URL}/bookings/me/${bookingId}/reschedule`, newDateRange, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to reschedule booking");
        }
        throw error;
    }
};

// ========== Landlord Functions ==========

export const getLandlordBookings = async (status: string, limit: number, page: number) => {
    try {
        const user = await getUserFromStorage();
        const token = user?.token;

        const response = await axios.get(`${BASE_URL}/bookings/landlord`, {
            params: { status, limit, page },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch landlord bookings");
        }
        throw error;
    }
};

export const getBookingByLandlord = async (bookingId: string,) => {
    try {
        const user = await getUserFromStorage();
        const token = user?.token;

        const response = await axios.get(`${BASE_URL}/bookings/landlord/${bookingId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch booking as landlord");
        }
        throw error;
    }
};

export const approveBooking = async (bookingId: string) => {
    try {
        const user = await getUserFromStorage();
        const token = user?.token;

        const response = await axios.put(`${BASE_URL}/bookings/landlord/${bookingId}/approve`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to approve booking");
        }
        throw error;
    }
};

export const rejectBooking = async (bookingId: string) => {
    try {
        const user = await getUserFromStorage();
        const token = user?.token;

        const response = await axios.put(`${BASE_URL}/bookings/landlord/${bookingId}/reject`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to reject booking");
        }
        // console.log(error)
        throw error;
    }
};
