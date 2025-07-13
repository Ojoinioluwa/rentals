import * as Yup from "yup";


// Validation Schema using Yup
export const AddPropertySchema = Yup.object().shape({
    title: Yup.string()
        .required("Title is required")
        .min(3, "Title must be at least 3 characters"),
    description: Yup.string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters"),
    propertyType: Yup.string()
        .required("Property type is required")
        .oneOf(
            [
                "apartment",
                "self-contain",
                "duplex",
                "shop",
                "office",
                "room",
                "studio",
            ],
            "Invalid property type"
        ),
    bedrooms: Yup.number()
        .min(0, "Bedrooms cannot be negative")
        .integer("Bedrooms must be a whole number")
        .typeError("Bedrooms must be a number"),
    bathrooms: Yup.number()
        .min(0, "Bathrooms cannot be negative")
        .integer("Bathrooms must be a whole number")
        .typeError("Bathrooms must be a number"),
    toilets: Yup.number()
        .min(0, "Toilets cannot be negative")
        .integer("Toilets must be a whole number")
        .typeError("Toilets must be a number"),
    furnished: Yup.boolean(),
    price: Yup.number()
        .required("Price is required")
        .positive("Price must be positive")
        .typeError("Price must be a number"),
    billingCycle: Yup.string()
        .required("Billing cycle is required")
        .oneOf(["monthly", "yearly"], "Invalid billing cycle"),
    fees: Yup.object().shape({
        caution: Yup.number()
            .min(0, "Caution fee cannot be negative")
            .typeError("Caution fee must be a number"),
    }),
    features: Yup.array().of(Yup.string()),
    images: Yup.array().of(Yup.string()).min(1, "At least one image is required"),
    location: Yup.object().shape({
        address: Yup.string().required("Address is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        country: Yup.string().required("Country is required"),
    }),
    isAvailable: Yup.boolean(),
});

export const EditPropertySchema = Yup.object().shape({
    title: Yup.string()
        .required("Title is required")
        .min(3, "Title must be at least 3 characters"),
    description: Yup.string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters"),
    propertyType: Yup.string()
        .required("Property type is required")
        .oneOf(
            [
                "apartment",
                "self-contain",
                "duplex",
                "shop",
                "office",
                "room",
                "studio",
            ],
            "Invalid property type"
        ),
    bedrooms: Yup.number()
        .min(0, "Bedrooms cannot be negative")
        .integer("Bedrooms must be a whole number")
        .typeError("Bedrooms must be a number"),
    bathrooms: Yup.number()
        .min(0, "Bathrooms cannot be negative")
        .integer("Bathrooms must be a whole number")
        .typeError("Bathrooms must be a number"),
    toilets: Yup.number()
        .min(0, "Toilets cannot be negative")
        .integer("Toilets must be a whole number")
        .typeError("Toilets must be a number"),
    furnished: Yup.boolean(),
    price: Yup.number()
        .required("Price is required")
        .positive("Price must be positive")
        .typeError("Price must be a number"),
    billingCycle: Yup.string()
        .required("Billing cycle is required")
        .oneOf(["monthly", "yearly"], "Invalid billing cycle"),
    caution: Yup.number()
        .min(0, "Caution fee cannot be negative")
        .typeError("Caution fee must be a number"),
    features: Yup.array().of(Yup.string()),
    isAvailable: Yup.boolean(),
});

export const BookingSchema = Yup.object().shape({
    message: Yup.string().max(500, "Message cannot exceed 500 characters"),
    rentStart: Yup.date()
        .required("Rent start date is required")
        .min(new Date(), "Rent start date cannot be in the past"),
    rentEnd: Yup.date()
        .required("Rent end date is required")
        .min(Yup.ref("rentStart"), "Rent end date must be after start date"),
});