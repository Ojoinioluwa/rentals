import {
  availableFeatures,
  FormInput,
  FormPicker,
  FormPickerProperty,
  FormSwitch,
} from "@/components/PropertyCard";
import { EditPropertySchema } from "@/schemas/schemas";
import {
  getPropertyById,
  updateProperty,
} from "@/services/landlord/landlordServices";
import { queryClient } from "@/utils/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const EditProperty: React.FC = () => {
  const router = useRouter();

  const { id } = useLocalSearchParams() as { id: string };

  const { data, isLoading, error } = useQuery({
    queryKey: ["property", id],
    queryFn: () => getPropertyById(id),
    enabled: !!id,
  });
  const propertyData = data?.property;

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["updateProperty"],
    mutationFn: updateProperty,
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
      billingCycle: "yearly",
      caution: 0,
      features: [] as string[],
      isAvailable: true,
    },
    validationSchema: EditPropertySchema,
    onSubmit: async (values) => {
      try {
        const response = await mutateAsync({ id, updates: values });

        Toast.show({
          type: "success",
          text1: response?.message,
        });

        formik.resetForm();
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "my-properties",
        });
        queryClient.invalidateQueries({ queryKey: ["property", id] });
        router.back();
      } catch (error: any) {
        Toast.show({
          type: "error",
          text1: error?.message || "Upload failed.",
        });
      }
    },
  });

  useEffect(() => {
    if (propertyData) {
      formik.setValues({
        title: propertyData.title || "",
        description: propertyData.description || "",
        propertyType: propertyData.propertyType || "",
        bedrooms: propertyData.bedrooms || 0,
        bathrooms: propertyData.bathrooms || 0,
        toilets: propertyData.toilets || 0,
        furnished: propertyData.furnished || false,
        price: propertyData.price || 0,
        billingCycle: propertyData.billingCycle || "yearly",
        caution: propertyData.fees.caution || 0,
        features: propertyData.features || [],
        isAvailable: propertyData.isAvailable ?? true,
      });
    }
  }, [propertyData]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-blue-50 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-blue-700 mt-4 text-lg">
          Loading Property Details...
        </Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-blue-50 justify-center items-center p-5">
        <Text className="text-red-500 text-lg text-center mb-4">
          {error instanceof Error ? error.message : "Property not found."}
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-blue-600 py-3 px-6 rounded-lg shadow-md"
        >
          <Text className="text-white text-base font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

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
            label="caution"
            placeholder="e.g., 500000"
            value={formik.values.caution.toString()}
            onChangeText={(text) =>
              formik.setFieldValue("caution", parseFloat(text) || 0)
            }
            onBlur={formik.handleBlur("caution")}
            error={formik.errors.caution}
            touched={formik.touched.caution}
            keyboardType="numeric"
            editable={!isPending}
            icon={<Text className="text-blue-600 text-lg">₦</Text>}
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
            <Text className="text-white text-lg font-bold">
              Update Property
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProperty;
