import React from "react";
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormInput } from "@/components/PropertyCard";
import Toast from "react-native-toast-message";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { changePassword } from "@/services/User/userServices";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

const ChangePassword: React.FC = () => {
  const router = useRouter(); // Uncomment if using Expo Router

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["ChangePassword"],
    mutationFn: changePassword,
  });

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const data = await mutateAsync({ password: values.newPassword });
        console.log(data);
        Toast.show({
          type: "success",
          text2: "You can now login with your new Password",
        });
        formik.resetForm();
        AsyncStorage.removeItem("user");
        router.replace("/Login");
      } catch (error: any) {
        console.log("Forgot password error", error);
        Toast.show({
          type: "error",
          text1: error.message,
          text2: "Please try again",
        });
      }
    },
  });

  const handleChangePassword = () => {
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
          {/* Back Button (optional, depending on navigation flow) */}
          <Animated.View
            entering={FadeInUp.delay(100).duration(500)}
            className="mb-6"
          >
            <TouchableOpacity
              onPress={() => console.log("Go back")} // Replace with router.back() or similar
              className="bg-blue-600 p-3 rounded-full shadow-lg self-start"
            >
              <Text className="text-white text-xl">⬅️</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Header */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(500)}
            className="mb-8"
          >
            <Text className="text-center text-blue-800 text-3xl font-bold mb-2">
              Change Password
            </Text>
            <Text className="text-center text-gray-600 text-base max-w-sm self-center">
              Enter your password
            </Text>
          </Animated.View>

          {/* Form Fields */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(600)}
            className="bg-white p-6 rounded-xl shadow-md mb-6"
          >
            <FormInput
              label="New Password"
              placeholder="Enter your new password"
              value={formik.values.newPassword}
              onChangeText={formik.handleChange("newPassword")}
              onBlur={formik.handleBlur("newPassword")}
              error={formik.errors.newPassword}
              touched={formik.touched.newPassword}
              secureTextEntry
              editable={!isPending}
              icon={<Text className="text-blue-600 text-lg">🔒</Text>}
            />

            <FormInput
              label="Confirm New Password"
              placeholder="Re-enter your new password"
              value={formik.values.confirmPassword}
              onChangeText={formik.handleChange("confirmPassword")}
              onBlur={formik.handleBlur("confirmPassword")}
              error={formik.errors.confirmPassword}
              touched={formik.touched.confirmPassword}
              secureTextEntry
              editable={!isPending}
              icon={<Text className="text-blue-600 text-lg">🔐</Text>}
            />
          </Animated.View>

          {/* Submit Button */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(600)}
            className="mb-10"
          >
            <TouchableOpacity
              onPress={handleChangePassword}
              className="bg-blue-600 py-4 rounded-xl flex-row items-center justify-center shadow-md"
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white text-lg font-bold">
                  Reset Password
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
});
