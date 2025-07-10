import { FormInput } from "@/components/PropertyCard";
import { VerifyEmailAPI } from "@/services/User/userServices";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router"; // Use useRouter for Expo Router
import { useFormik } from "formik";
import React from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import * as Yup from "yup";

export const ButtonUI: React.FC<{
  name: string;
  isPending?: boolean;
  onPress: () => void;
}> = ({ name, isPending, onPress }) => (
  <TouchableOpacity
    className={`py-4 rounded-xl items-center mt-5 ${
      isPending ? "bg-blue-300" : "bg-blue-600"
    } shadow-md`} // Using Tailwind classes
    onPress={onPress}
    disabled={isPending}
  >
    <Text className="text-white text-lg font-semibold">
      {isPending ? "Verifying..." : name}
    </Text>
  </TouchableOpacity>
);

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  verificationCode: Yup.string()
    .required("Verification code is required")
    .matches(/^[0-9]{6}$/, "OTP must be exactly 6 digits")
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits"),
});

const { height } = Dimensions.get("window");

function VerifyEmail() {
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["verifyEmail"],
    mutationFn: VerifyEmailAPI,
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      verificationCode: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      try {
        const data = await mutateAsync(values);
        console.log(data);

        Toast.show({
          type: "success",
          text1: data?.message,
        });
        formik.resetForm();
        router.replace("/Login");
      } catch (error: any) {
        console.error("Verification failed:", error);
        Toast.show({
          type: "error",
          text1: error.message,
        });
      }
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              We&apos;ve sent a verification code to your email. Please check
              your inbox to continue.
            </Text>

            <View style={styles.form}>
              <FormInput
                label="Email Address"
                placeholder="Enter your email"
                value={formik.values.email}
                onChangeText={formik.handleChange("email")}
                onBlur={formik.handleBlur("email")}
                error={formik.errors.email}
                touched={formik.touched.email}
                keyboardType="email-address"
                editable={!isPending}
              />

              <FormInput
                label="Verification Code (OTP)"
                placeholder="Enter 6-digit code"
                value={formik.values.verificationCode}
                onChangeText={formik.handleChange("verificationCode")}
                onBlur={formik.handleBlur("verificationCode")}
                error={formik.errors.verificationCode}
                touched={formik.touched.verificationCode}
                keyboardType="numeric"
                secureTextEntry={false}
                editable={!isPending}
              />

              <ButtonUI
                isPending={isPending}
                name="Verify Email"
                onPress={formik.handleSubmit}
              />
            </View>

            {/* Optional: Resend Code Link */}
            {/* <TouchableOpacity
              style={styles.resendCodeContainer}
              onPress={() => console.log("Resend code pressed")}
            >
              <Text style={styles.resendCodeText}>
                Did not receive the code?{" "}
                <Text style={styles.resendCodeLink}>Resend</Text>
              </Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa", // Light background color, can be adjusted or use Tailwind
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: height * 0.05,
  },
  container: {
    paddingHorizontal: 25,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1a237e",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  form: {
    width: "100%",
    // The gap between FormInput components is handled by FormInput's own margin-bottom
    marginTop: 10,
  },
  // Removed individual input styling as FormInput handles it
  resendCodeContainer: {
    marginTop: 30,
    paddingVertical: 10,
  },
  resendCodeText: {
    fontSize: 15,
    color: "#6c757d",
  },
  resendCodeLink: {
    color: "#007bff",
    fontWeight: "bold",
  },
});

export default VerifyEmail;
