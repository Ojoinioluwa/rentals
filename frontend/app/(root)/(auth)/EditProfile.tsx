import React from "react";
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { FormInput } from "@/components/PropertyCard";
import { UpdateProfile } from "@/services/User/userServices";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { queryClient } from "@/utils/queryClient";

// Define a validation schema for the form using Yup
const validationSchema = Yup.object().shape({
  firstName: Yup.string().nullable(),
  lastName: Yup.string().nullable(),
  phoneNumber: Yup.string()
    .matches(/^\d{11}$/, "Phone number must be exactly 11 digits")
    .nullable(),
  email: Yup.string().email("Invalid email format").nullable(),
});

const EditProfileScreen: React.FC = () => {
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["EditProfile"],
    mutationFn: UpdateProfile,
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await mutateAsync(values);
        Toast.show({
          type: "success",
          text1: response?.message,
        });
        formik.resetForm();
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        await AsyncStorage.removeItem("user");
        router.replace("/Login");
      } catch (error: any) {
        Toast.show({
          type: "error",
          text1: error.message,
        });
      }
    },
  });

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          className="flex-1 p-5"
        >
          {/* Header */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(500)}
            className="mb-8 items-center"
          >
            <Text className="text-center text-blue-800 text-3xl font-bold mb-2">
              Edit Profile
            </Text>
            <Text className="text-center text-gray-600 text-base max-w-sm">
              Update your personal information.
            </Text>
          </Animated.View>

          {/* Form Fields */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(600)}
            className="bg-white p-6 rounded-xl shadow-md mb-6"
          >
            <FormInput
              label="First Name"
              placeholder="Enter your first name"
              value={formik.values.firstName}
              onChangeText={formik.handleChange("firstName")}
              onBlur={formik.handleBlur("firstName")}
              error={formik.errors.firstName}
              touched={formik.touched.firstName}
              editable={!isPending}
              icon={<Text className="text-blue-600 text-lg">👤</Text>}
            />
            <FormInput
              label="Last Name"
              placeholder="Enter your last name"
              value={formik.values.lastName}
              onChangeText={formik.handleChange("lastName")}
              onBlur={formik.handleBlur("lastName")}
              error={formik.errors.lastName}
              touched={formik.touched.lastName}
              editable={!isPending}
              icon={<Text className="text-blue-600 text-lg">👥</Text>}
            />
            <FormInput
              label="Email"
              onChangeText={formik.handleChange("email")}
              placeholder="Your email address"
              value={formik.values.email}
              onBlur={formik.handleBlur("email")}
              keyboardType="email-address"
              editable={false} // Email typically not editable
              icon={<Text className="text-blue-600 text-lg">📧</Text>}
            />
            <FormInput
              label="Phone Number"
              placeholder="e.g., 08012345678"
              value={formik.values.phoneNumber}
              onChangeText={formik.handleChange("phoneNumber")}
              onBlur={formik.handleBlur("phoneNumber")}
              error={formik.errors.phoneNumber}
              touched={formik.touched.phoneNumber}
              keyboardType="phone-pad"
              editable={!isPending}
              icon={<Text className="text-blue-600 text-lg">📞</Text>}
            />
            {/* Add more fields as needed, e.g., userType (if editable), address, etc. */}
          </Animated.View>

          {/* Save Changes Button */}
          <Animated.View
            entering={FadeInUp.delay(500).duration(600)}
            className="mb-10"
          >
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-blue-600 py-4 rounded-xl flex-row items-center justify-center shadow-md"
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white text-lg font-bold">
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Go Back Button */}
          <Animated.View
            entering={FadeInUp.delay(600).duration(600)}
            className="mb-10"
          >
            <TouchableOpacity
              onPress={() => router.back()} // Replace with router.back() or similar
              className="bg-gray-300 py-4 rounded-xl flex-row items-center justify-center shadow-md"
            >
              <Text className="text-gray-800 text-lg font-bold">Go Back</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1, // Ensures content takes up available space for centering
    paddingBottom: 30, // Add some padding at the bottom for scrollability
  },
});
