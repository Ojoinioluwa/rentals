import { optimizeImage } from "@/components/ImageOptimizer";
import {
  availableFeatures,
  FormInput,
  FormPicker,
  FormPickerProperty,
  FormSwitch,
} from "@/components/PropertyCard";
import { AddPropertySchema } from "@/schemas/schemas";
import { createProperty } from "@/services/landlord/landlordServices";
import { queryClient } from "@/utils/queryClient";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
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

const AddPropertyForm: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const router = useRouter();

  // Placeholder for useMutation
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["addProperty"],
    mutationFn: createProperty,
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      propertyType: "",
      bedrooms: 0,
      bathrooms: 0,
      toilets: 0,
      furnished: false,
      price: 0,
      billingCycle: "yearly", // Default as per schema
      fees: {
        caution: 0,
      },
      features: [] as string[],
      images: [] as string[], // Placeholder for image URLs
      location: {
        address: "",
        city: "",
        state: "",
        country: "",
      },
      isAvailable: true,
    },
    validationSchema: AddPropertySchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        // Append images
        selectedImages.forEach((uri) => {
          const filename = uri.split("/").pop() || `image-${Date.now()}.jpg`;
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image`;

          formData.append("images", {
            uri,
            name: filename,
            type,
          } as any);
        });

        // Append primitive fields
        Object.entries(values).forEach(([key, val]) => {
          if (typeof val !== "object" && key !== "isAvailable") {
            formData.append(key, String(val));
          }
        });

        // Manually handle nested fields
        formData.append("fees", JSON.stringify(values.fees));
        formData.append("location", JSON.stringify(values.location));
        formData.append("features", JSON.stringify(values.features));
        formData.append("isAvailable", JSON.stringify(values.isAvailable));

        const response = await mutateAsync(formData);

        Toast.show({
          type: "success",
          text1: response?.message,
        });

        formik.resetForm();
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "my-properties",
        });

        router.push("/MyProperties");
        setSelectedImages([]);
      } catch (error: any) {
        Toast.show({
          type: "error",
          text1: error?.message || "Upload failed.",
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

  const addRealImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Toast.show({
        type: "error",
        text1: "Permission denied",
        text2: "You need to allow access to your media library.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      const optimizedUri = await optimizeImage(uri);
      setSelectedImages((prev) => [...prev, optimizedUri]);

      // Also update Formik field
      formik.setFieldValue("images", [...formik.values.images, uri]);

      Toast.show({
        type: "success",
        text1: "Image selected!",
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50 pb-10">
      <ScrollView className="flex-1 p-5 mb-10">
        <Text className="text-center text-blue-800 text-3xl font-bold mb-6">
          Add New Property
        </Text>
        <Text className="text-center text-gray-600 text-base mb-8">
          Fill in the details to list your property for rent.
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
          <FormPickerProperty
            label="Property Type"
            value={formik.values.propertyType}
            onValueChange={(val) => formik.setFieldValue("propertyType", val)}
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
          {/* <FormPicker
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
          /> */}
          <FormPickerProperty
            label="Billing Cycle"
            value={formik.values.billingCycle}
            onValueChange={(val) => formik.setFieldValue("billingCycle", val)}
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
              formik.setFieldValue("fees", {
                ...formik.values.fees,
                caution: parseFloat(text) || 0,
              })
            }
            onBlur={() => formik.setFieldTouched("fees.caution", true)}
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
            onPress={addRealImage}
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
              <Image
                key={index}
                source={{ uri: imageUri }}
                className="w-24 h-24 m-1 rounded-lg border border-gray-300"
                resizeMode="cover"
              />
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
          onPress={() => {
            formik.handleSubmit();
          }}
          className="bg-blue-600 py-4 rounded-xl flex-row items-center justify-center shadow-md mb-10"
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white text-lg font-bold">Add Property</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddPropertyForm;
