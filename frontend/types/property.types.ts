import { ReactNode } from 'react';

export interface Property {
    _id: string;
    title: string;
    description: string;
    propertyType:
    | "apartment"
    | "self-contain"
    | "duplex"
    | "shop"
    | "office"
    | "room"
    | "studio";
    bedrooms: number;
    bathrooms: number;
    toilets: number;
    furnished: boolean;
    price: number;
    billingCycle: "monthly" | "yearly";
    fees: {
        agency?: number;
        caution: number;
    };
    features: string[];
    images: string[];
    location: {
        address: string;
        city: string;
        state: string;
        country: string;
        coordinates: [number, number];
    };
    isAvailable: boolean;
    availableFrom?: Date;
    landlord: {
        _id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
}

export interface TenantPropertyDetailsScreenProps {
    propertyId: string;
    onGoBack?: () => void;
    onBookNow?: (propertyId: string) => void;
}

export interface PropertyDetailsScreenProps {
    propertyId: string;
    onGoBack?: () => void;
}

export interface PropertyCardProps {
    property: Property;
    onPress: (propertyId: string) => void;
}

export interface DetailItemProps {
    icon: string;
    label: string;
    value: string | number;
    color?: string;
}

export interface FormInputProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    onBlur: (e: any) => void;
    error?: string;
    touched?: boolean;
    keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
    multiline?: boolean;
    numberOfLines?: number;
    icon?: ReactNode;
    secureTextEntry?: boolean;
    editable?: boolean;
}

export interface FormSwitchProps {
    label: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
}

export interface FormPickerProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    onBlur: (e: any) => void;
    error?: string;
    touched?: boolean;
    options: string[];
    icon?: ReactNode;
    editable?: boolean;
}

export interface FormPickerPropertyProps {
    label: string;
    value: string;
    onValueChange: (value: string, index: number) => void;
    error?: string;
    touched?: boolean;
    options: string[];
    icon?: React.ReactNode;
    editable?: boolean;
}

export interface EditPropertyFormProps {
    propertyId: string;
}
