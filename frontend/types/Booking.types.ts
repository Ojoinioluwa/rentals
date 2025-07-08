export interface PropertyForBooking {
    _id: string;
    title: string;
    propertyType: string;
    description: string;
    images: string[];
}

// Define the type for Tenant details (populated)
export interface TenantDetails {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface CreateBookingScreenProps {
    propertyId: string; // ID of the property for which to create a booking
    onBookingSuccess?: () => void; // Optional callback after successful booking
    onGoBack?: () => void; // Optional callback to navigate back
}

export interface Booking {
    _id: string;
    property: PropertyForBooking; // Populated property details
    tenant: TenantDetails; // Populated tenant details
    landlord: string; // Landlord ID (assuming current user)
    message?: string;
    status: "pending" | "approved" | "rejected" | "cancelled";
    rentStart: Date;
    rentEnd: Date;
    isPaid: boolean;
    createdAt: Date;
}


export interface LandlordBookingCardProps {
    booking: Booking;
    onPressDetails: (bookingId: string) => void;
    onApprove?: (bookingId: string) => void;
    onReject?: (bookingId: string) => void;
    onMessageTenant?: (tenantEmail: string) => void;
    isProcessing?: boolean; // To disable buttons during action
}

export interface BookingFormValues {
    message: string;
    rentStart: Date | null;
    rentEnd: Date | null;
}
