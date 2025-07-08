import {
  availableFeatures,
  FormInput,
  FormPicker,
  FormSwitch,
} from "@/components/PropertyCard";
import { EditPropertySchema } from "@/schemas/schemas";
import { Property } from "@/types/property.types";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

// Validation Schema using Yup

interface EditPropertyFormProps {
  propertyId: string; // The ID of the property to edit
}

const EditPropertyForm: React.FC<EditPropertyFormProps> = ({ propertyId }) => {
  // State to hold the initial property data fetched from the API
  const [initialPropertyData, setInitialPropertyData] =
    useState<Property | null>(null);
  const [isLoadingProperty, setIsLoadingProperty] = useState<boolean>(true);

  // Placeholder for useQuery to fetch property data
  // const { data: propertyData, isLoading: isLoadingProperty, error: fetchError } = useQuery<Property, Error>({
  //   queryKey: ['property', propertyId],
  //   queryFn: async () => {
  //     // Replace with your actual API call to fetch property by ID
  //     console.log('Fetching property with ID:', propertyId);
  //     return new Promise((resolve, reject) => {
  //       setTimeout(() => {
  //         if (propertyId === 'mock-property-123') { // Simulate fetching a specific property
  //           resolve({
  //             _id: 'mock-property-123',
  //             title: 'Cozy 2-Bedroom Apartment',
  //             description: 'A beautiful apartment in the heart of the city with great amenities.',
  //             propertyType: 'apartment',
  //             bedrooms: 2,
  //             bathrooms: 1,
  //             toilets: 2,
  //             furnished: true,
  //             price: 350000,
  //             billingCycle: 'yearly',
  //             fees: { caution: 25000 },
  //             features: ['Water Supply', 'Electricity', 'Parking'],
  //             images: [
  //               'https://placehold.co/150x100/ADD8E6/000000?text=Existing%20Image%201',
  //               'https://placehold.co/150x100/ADD8E6/000000?text=Existing%20Image%202',
  //             ],
  //             location: {
  //               address: '123 Main Street',
  //               city: 'Lagos',
  //               state: 'Lagos State',
  //               country: 'Nigeria',
  //             },
  //             isAvailable: true,
  //             availableFrom: new Date(),
  //           });
  //         } else {
  //           reject(new Error('Property not found!'));
  //         }
  //       }, 1000);
  //     });
  //   },
  //   enabled: !!propertyId, // Only fetch if propertyId is provided
  // });

  // Placeholder for useMutation for updating property
  const { mutateAsync, isPending: isUpdating } = useMutation({
    mutationKey: ["updateProperty"],
    mutationFn: async (updatedPropertyData: Partial<Property>) => {
      // Replace with your actual API call to update property
      console.log("Updating property data:", updatedPropertyData);
      return new Promise((resolve) => {
        setTimeout(() => {
          if (Math.random() > 0.1) {
            // Simulate success 90% of the time
            resolve({
              success: true,
              message: "Property updated successfully!",
            });
          } else {
            throw new Error("Failed to update property. Please try again.");
          }
        }, 1500);
      });
    },
  });

  const isPending = isLoadingProperty || isUpdating; // Overall pending state

  const formik = useFormik({
    initialValues: initialPropertyData || {
      // Use fetched data or default empty values
      title: "",
      description: "",
      propertyType: "",
      bedrooms: 0,
      bathrooms: 0,
      toilets: 0,
      furnished: false,
      price: 0,
      billingCycle: "yearly",
      fees: {
        caution: 0,
      },
      features: [],
      images: [],
      location: {
        address: "",
        city: "",
        state: "",
        country: "",
      },
      isAvailable: true,
    },
    enableReinitialize: true, // Reinitialize form when initialPropertyData changes
    validationSchema: EditPropertySchema,
    onSubmit: async (values) => {
      console.log("Form values submitted for update:", values);
      try {
        const response = await mutateAsync(values); // Pass values to mutation
        Toast.show({
          type: "success",
          text1: response.message,
        });
        // Optionally navigate or show success message
      } catch (error: any) {
        Toast.show({
          type: "error",
          text1: error.message || "An error occurred during update",
        });
      }
    },
  });

  // Function to toggle features
  const toggleFeature = (feature: string) => {
    const currentFeatures = formik.values.features;
    if (currentFeatures.includes(feature)) {
      formik.setFieldValue(
        "features",
        currentFeatures.filter((f) => f !== feature)
      );
    } else {
      formik.setFieldValue("features", [...currentFeatures, feature]);
    }
  };

  // Placeholder for adding images (you'd integrate image picker/upload here)
  const addDummyImage = () => {
    const dummyImageUrl = `https://placehold.co/150x100/ADD8E6/000000?text=New%20Image%20${
      formik.values.images.length + 1
    }`;
    formik.setFieldValue("images", [...formik.values.images, dummyImageUrl]);
  };

  // Placeholder for removing images
  const removeImage = (indexToRemove: number) => {
    formik.setFieldValue(
      "images",
      formik.values.images.filter((_, index) => index !== indexToRemove)
    );
  };

  if (isLoadingProperty) {
    return (
      <SafeAreaView className="flex-1 bg-blue-50 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-blue-700 mt-4 text-lg">
          Loading Property Data...
        </Text>
      </SafeAreaView>
    );
  }

  if (!initialPropertyData && !isLoadingProperty) {
    return (
      <SafeAreaView className="flex-1 bg-blue-50 justify-center items-center">
        <Text className="text-red-500 text-lg">
          Property not found or an error occurred.
        </Text>
        <TouchableOpacity
          onPress={() => console.log("Navigate back or retry")}
          className="bg-blue-600 py-3 px-6 rounded-lg mt-4"
        >
          <Text className="text-white text-base">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <ScrollView className="flex-1 p-5">
        <Text className="text-center text-blue-800 text-3xl font-bold mb-6">
          Edit Property
        </Text>
        <Text className="text-center text-gray-600 text-base mb-8">
          Update the details of your listed property.
        </Text>

        {/* Property Details */}
        <View className="bg-white p-5 rounded-xl shadow-md mb-6">
          <Text className="text-blue-700 text-xl font-bold mb-4">
            Property Details
          </Text>
          <FormInput
            label="Property Title"
            placeholder="e.g., Spacious 3-Bedroom Apartment"
            value={formik.values.title}
            onChangeText={formik.handleChange("title")}
            onBlur={formik.handleBlur("title")}
            error={formik.errors.title}
            touched={formik.touched.title}
            editable={!isPending}
            icon={<Text className="text-blue-600 text-lg">🏠</Text>}
          />
          <FormInput
            label="Description"
            placeholder="Provide a detailed description of the property..."
            value={formik.values.description}
            onChangeText={formik.handleChange("description")}
            onBlur={formik.handleBlur("description")}
            error={formik.errors.description}
            touched={formik.touched.description}
            multiline
            numberOfLines={4}
            editable={!isPending}
            icon={<Text className="text-blue-600 text-lg">📝</Text>}
          />
          <FormPicker
            label="Property Type"
            placeholder="Select type (e.g., apartment)"
            value={formik.values.propertyType}
            onChangeText={formik.handleChange("propertyType")}
            onBlur={formik.handleBlur("propertyType")}
            error={formik.errors.propertyType}
            touched={formik.touched.propertyType}
            options={[
              "apartment",
              "self-contain",
              "duplex",
              "shop",
              "office",
              "room",
              "studio",
            ]}
            editable={!isPending}
            icon={<Text className="text-blue-600 text-lg">🏡</Text>}
          />
          <FormInput
            label="Bedrooms"
            placeholder="Number of bedrooms"
            value={formik.values.bedrooms.toString()}
            onChangeText={(text) =>
              formik.setFieldValue("bedrooms", parseInt(text) || 0)
            }
            onBlur={formik.handleBlur("bedrooms")}
            error={formik.errors.bedrooms}
            touched={formik.touched.bedrooms}
            keyboardType="numeric"
            editable={!isPending}
            icon={<Text className="text-blue-600 text-lg">🛏️</Text>}
          />
          <FormInput
            label="Bathrooms"
            placeholder="Number of bathrooms"
            value={formik.values.bathrooms.toString()}
            onChangeText={(text) =>
              formik.setFieldValue("bathrooms", parseInt(text) || 0)
            }
            onBlur={formik.handleBlur("bathrooms")}
            error={formik.errors.bathrooms}
            touched={formik.touched.bathrooms}
            keyboardType="numeric"
            editable={!isPending}
            icon={<Text className="text-blue-600 text-lg">🚿</Text>}
          />
          <FormInput
            label="Toilets"
            placeholder="Number of toilets"
            value={formik.values.toilets.toString()}
            onChangeText={(text) =>
              formik.setFieldValue("toilets", parseInt(text) || 0)
            }
            onBlur={formik.handleBlur("toilets")}
            error={formik.errors.toilets}
            touched={formik.touched.toilets}
            keyboardType="numeric"
            editable={!isPending}
            icon={<Text className="text-blue-600 text-lg">🚽</Text>}
          />
          <FormSwitch
            label="Furnished"
            value={formik.values.furnished}
            onValueChange={(value) => formik.setFieldValue("furnished", value)}
          />
        </View>

        {/* Pricing & Billing */}
        <View className="bg-white p-5 rounded-xl shadow-md mb-6">
          <Text className="text-blue-700 text-xl font-bold mb-4">
            Pricing & Billing
          </Text>
          <FormInput
            label="Price"
            placeholder="e.g., 500000"
            value={formik.values.price.toString()}
            onChangeText={(text) =>
              formik.setFieldValue("price", parseFloat(text) || 0)
            }
            onBlur={formik.handleBlur("price")}
            error={formik.errors.price}
            touched={formik.touched.price}
            keyboardType="numeric"
            editable={!isPending}
            icon={<Text className="text-blue-600 text-lg">₦</Text>}
          />
          <FormPicker
            label="Billing Cycle"
            placeholder="Select cycle (e.g., yearly)"
            value={formik.values.billingCycle}
            onChangeText={formik.handleChange("billingCycle")}
            onBlur={formik.handleBlur("billingCycle")}
            error={formik.errors.billingCycle}
            touched={formik.touched.billingCycle}
            options={["monthly", "yearly"]}
            editable={!isPending}
            icon={<Text className="text-blue-600 text-lg">🗓️</Text>}
          />
          <FormInput
            label="Caution Fee"
            placeholder="e.g., 50000 (optional)"
            value={formik.values.fees.caution.toString()}
            onChangeText={(text) =>
              formik.setFieldValue("fees.caution", parseFloat(text) || 0)
            }
            onBlur={formik.handleBlur("fees.caution")}
            error={formik.errors.fees?.caution}
            touched={formik.touched.fees?.caution}
            keyboardType="numeric"
            editable={!isPending}
            icon={<Text className="text-blue-600 text-lg">🛡️</Text>}
          />
        </View>

        {/* Features */}
        <View className="bg-white p-5 rounded-xl shadow-md mb-6">
          <Text className="text-blue-700 text-xl font-bold mb-4">Features</Text>
          <View className="flex-row flex-wrap">
            {availableFeatures.map((feature) => (
              <TouchableOpacity
                key={feature}
                onPress={() => toggleFeature(feature)}
                className={`flex-row items-center px-3 py-2 m-1 rounded-full border ${
                  formik.values.features.includes(feature)
                    ? "bg-blue-100 border-blue-500"
                    : "bg-gray-100 border-gray-300"
                }`}
                disabled={isPending}
              >
                <Text
                  className={`text-sm font-medium ${
                    formik.values.features.includes(feature)
                      ? "text-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  {feature}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {formik.touched.features && formik.errors.features && (
            <Text className="text-red-500 text-sm mt-2 ml-2">
              {formik.errors.features}
            </Text>
          )}
        </View>

        {/* Images */}
        <View className="bg-white p-5 rounded-xl shadow-md mb-6">
          <Text className="text-blue-700 text-xl font-bold mb-4">
            Property Images
          </Text>
          <TouchableOpacity
            onPress={addDummyImage}
            className="bg-blue-500 py-3 rounded-lg flex-row items-center justify-center mb-4"
            disabled={isPending}
          >
            <Text className="text-white text-base font-semibold mr-2">
              Add Image
            </Text>
            <Text className="text-white text-lg">📸</Text>
          </TouchableOpacity>
          {formik.touched.images && formik.errors.images && (
            <Text className="text-red-500 text-sm mt-1 ml-2 mb-2">
              {formik.errors.images}
            </Text>
          )}
          <View className="flex-row flex-wrap justify-center">
            {formik.values.images.map((imageUri, index) => (
              <View
                key={index}
                className="relative w-24 h-24 m-1 rounded-lg border border-gray-300"
              >
                <Image
                  source={{ uri: imageUri }}
                  className="w-full h-full rounded-lg"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                  disabled={isPending}
                >
                  <Text className="text-white text-xs font-bold">✖️</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {formik.values.images.length > 0 && (
            <Text className="text-gray-500 text-sm text-center mt-2">
              {formik.values.images.length} image(s) added.
            </Text>
          )}
        </View>

        {/* Location Details */}
        <View className="bg-white p-5 rounded-xl shadow-md mb-6">
          <Text className="text-blue-700 text-xl font-bold mb-4">
            Location Details
          </Text>
          <FormInput
            label="Address"
            placeholder="Street address, apartment number"
            value={formik.values.location.address}
            onChangeText={formik.handleChange("location.address")}
            onBlur={formik.handleBlur("location.address")}
            error={formik.errors.location?.address}
            touched={formik.touched.location?.address}
            editable={!isPending}
            icon={<Text className="text-blue-600 text-lg">📍</Text>}
          />
          <FormInput
            label="City"
            placeholder="e.g., Lagos"
            value={formik.values.location.city}
            onChangeText={formik.handleChange("location.city")}
            onBlur={formik.handleBlur("location.city")}
            error={formik.errors.location?.city}
            touched={formik.touched.location?.city}
            editable={!isPending}
            icon={<Text className="text-blue-600 text-lg">🏙️</Text>}
          />
          <FormInput
            label="State"
            placeholder="e.g., Lagos State"
            value={formik.values.location.state}
            onChangeText={formik.handleChange("location.state")}
            onBlur={formik.handleBlur("location.state")}
            error={formik.errors.location?.state}
            touched={formik.touched.location?.state}
            editable={!isPending}
            icon={<Text className="text-blue-600 text-lg">🗺️</Text>}
          />
          <FormInput
            label="Country"
            placeholder="e.g., Nigeria"
            value={formik.values.location.country}
            onChangeText={formik.handleChange("location.country")}
            onBlur={formik.handleBlur("location.country")}
            error={formik.errors.location?.country}
            touched={formik.touched.location?.country}
            editable={!isPending}
            icon={<Text className="text-blue-600 text-lg">🌍</Text>}
          />
          <Text className="text-gray-500 text-xs mt-1 ml-2">
            * For real app, integrate Google Places API for address and
            coordinates.
          </Text>
        </View>

        {/* Availability */}
        <View className="bg-white p-5 rounded-xl shadow-md mb-6">
          <Text className="text-blue-700 text-xl font-bold mb-4">
            Availability
          </Text>
          <FormSwitch
            label="Is Property Available?"
            value={formik.values.isAvailable}
            onValueChange={(value) =>
              formik.setFieldValue("isAvailable", value)
            }
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={() => formik.handleSubmit()}
          className="bg-blue-600 py-4 rounded-xl flex-row items-center justify-center shadow-md mb-10"
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white text-lg font-bold">
              Update Property
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditPropertyForm;
