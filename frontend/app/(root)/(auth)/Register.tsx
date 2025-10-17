import icons from "@/constants/icons";
import { RegisterAPI } from "@/services/User/userServices";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { useFormik } from "formik";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { UserRole } from "./RoleSelection";

const validationSchema = Yup.object({
  email: Yup.string().required("Email is required").email("Email is invalid"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[^A-Za-z0-9]/, "Password must contain at least one symbol")
    .matches(/^\S*$/, "Password must not contain spaces"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
  firstName: Yup.string()
    .required("First name is required")
    .min(3, "First name must be at least 3 characters"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(3, "Last name must be at least 3 characters"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .min(10, "Phone number must be at least 10 digits"),
  address: Yup.string().required("Address is required"),
}); // !move to the schemas folder next time

type Role = {
  auth: {
    role: UserRole;
  };
};

const Register = () => {
  const role = useSelector((state: Role) => state.auth.role);
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: RegisterAPI,
  });

  const [passVisible, setPassVisible] = useState(false);
  const [confirmPassVisible, setConfirmPassVisible] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const newValues = {
        ...values,
        role: role,
      };
      mutateAsync(newValues)
        .then((response) => {
          Toast.show({
            type: "success",
            text1: response?.message || "Registration successful",
            text2: "Welcome to the app 👋",
          });
          router.replace("/VerifyEmail");
        })
        .catch((error) => {
          // console.log("Register error", error);
          Toast.show({
            type: "error",
            text1: error.message,
            text2: "Please try again",
          });
        });
    },
  });

  const handleRegister = () => {
    formik.handleSubmit();
  };

  return (
    <SafeAreaView className="bg-gray-200 flex-1">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-5 mt-5 pb-5 ">
            <Text className="font-rubik-extrabold font-bold text-3xl text-center">
              Lets Get Started!
            </Text>
            <Text className="text-gray-400 text-center font-rubix-light text-xl">
              Create an Account to start saving
            </Text>
            <View className="mt-12">
              {/* first Name */}
              <View className="bg-white py-3 rounded-full flex flex-row  items-center mb-1 mt-4">
                <Image source={icons.eye} className="size-5 ml-5 " />
                <TextInput
                  value={formik.values.firstName}
                  editable={!isPending}
                  placeholderTextColor="gray"
                  placeholder="👤 First Name"
                  className="font-rubix-medium flex-1"
                  onChangeText={formik.handleChange("firstName")}
                  onBlur={formik.handleBlur("firstName")}
                />
              </View>
              {formik.touched.firstName && formik.errors.firstName && (
                <Text className="text-red-500 text-sm mt-1 mb-4">
                  {formik.errors.firstName}
                </Text>
              )}
              {/* last name */}
              <View className="bg-white py-3 rounded-full flex flex-row  items-center mb-1 mt-4">
                <Image source={icons.eye} className="size-5 ml-5 " />
                <TextInput
                  value={formik.values.lastName}
                  editable={!isPending}
                  placeholderTextColor="gray"
                  placeholder="👤 Last Name"
                  className="font-rubix-medium flex-1"
                  onChangeText={formik.handleChange("lastName")}
                  onBlur={formik.handleBlur("lastName")}
                />
              </View>
              {formik.touched.lastName && formik.errors.lastName && (
                <Text className="text-red-500 text-sm mt-1 mb-4">
                  {formik.errors.lastName}
                </Text>
              )}

              {/* email */}
              <View className="bg-white py-3 rounded-full flex flex-row  items-center mb-1 mt-4">
                <Image source={icons.location} className="size-5 ml-5" />
                <TextInput
                  value={formik.values.email}
                  editable={!isPending}
                  placeholderTextColor="gray"
                  placeholder="📪 Email"
                  className="font-rubix-medium flex-1"
                  onChangeText={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
                />
              </View>
              {formik.touched.email && formik.errors.email && (
                <Text className="text-red-500 text-sm mt-1 mb-4">
                  {formik.errors.email}
                </Text>
              )}

              {/* phonenumber */}
              <View className="bg-white py-3 rounded-full flex flex-row  items-center mb-1 mt-4">
                <Image source={icons.language} className="size-5 ml-5" />
                <TextInput
                  value={formik.values.phoneNumber}
                  editable={!isPending}
                  placeholderTextColor="gray"
                  placeholder="📵 Phone"
                  className="font-rubix-medium flex-1"
                  onChangeText={formik.handleChange("phoneNumber")}
                  onBlur={formik.handleBlur("phoneNumber")}
                />
              </View>
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <Text className="text-red-500 text-sm mt-1 mb-4">
                  {formik.errors.phoneNumber}
                </Text>
              )}
              {/* Address */}
              <View className="bg-white py-3 rounded-full flex flex-row  items-center mb-1 mt-4">
                <Image source={icons.location} className="size-5 ml-5" />
                <TextInput
                  value={formik.values.address}
                  editable={!isPending}
                  placeholderTextColor="gray"
                  placeholder="Home Address"
                  className="font-rubix-medium flex-1"
                  onChangeText={formik.handleChange("address")}
                  onBlur={formik.handleBlur("address")}
                />
              </View>
              {formik.touched.address && formik.errors.address && (
                <Text className="text-red-500 text-sm mt-1 mb-4">
                  {formik.errors.address}
                </Text>
              )}
              {/* password */}
              <View className="bg-white py-3 rounded-full flex flex-row items-center mb-1 mt-4">
                <Image source={icons.info} className="size-5 ml-5" />
                <TextInput
                  value={formik.values.password}
                  editable={!isPending}
                  secureTextEntry={!passVisible}
                  placeholder="🔑 Password"
                  placeholderTextColor="#888" // use hex for safety
                  onChangeText={formik.handleChange("password")}
                  onBlur={formik.handleBlur("password")}
                  style={{
                    flex: 1,
                    color: "#000", // force black text
                    fontSize: 16,
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    backgroundColor: "#fff", // prevent invisible text issue
                    borderRadius: 8,
                  }}
                />

                <TouchableOpacity
                  onPress={() => setPassVisible(!passVisible)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Image
                    source={passVisible ? icons.eye : icons.eyeOff}
                    className="size-6 mr-5"
                  />
                </TouchableOpacity>
              </View>
              {formik.touched.password && formik.errors.password && (
                <Text className="text-red-500 text-sm mt-1 mb-4">
                  {formik.errors.password}
                </Text>
              )}

              {/* confirm password */}
              <View className="bg-white py-3 rounded-full flex flex-row  items-center mb-1 mt-4">
                <Image source={icons.info} className="size-5 ml-5" />
                <TextInput
                  value={formik.values.confirmPassword}
                  editable={!isPending}
                  secureTextEntry={!confirmPassVisible}
                  placeholder="🔑 Confirm password"
                  placeholderTextColor="#888"
                  onChangeText={formik.handleChange("confirmPassword")}
                  onBlur={formik.handleBlur("confirmPassword")}
                  style={{
                    flex: 1,
                    color: "#000", // explicitly black
                    fontSize: 16,
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    backgroundColor: "#fff", // ensure contrast
                    borderRadius: 8,
                  }}
                />

                <TouchableOpacity
                  onPress={() => setConfirmPassVisible(!confirmPassVisible)}
                >
                  <Image
                    source={confirmPassVisible ? icons.eye : icons.eyeOff}
                    className="size-5 mr-5"
                  />
                </TouchableOpacity>
              </View>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <Text className="text-red-500 text-sm mt-1 mb-4">
                    {formik.errors.confirmPassword}
                  </Text>
                )}
            </View>
            {/* register */}
            <View className="flex justify-center items-center mt-5 ">
              <TouchableOpacity
                className="bg-blue-950 w-full py-5 rounded-full"
                onPress={handleRegister}
              >
                {isPending ? (
                  <ActivityIndicator />
                ) : (
                  <Text className="text-white text-center">CREATE ACCOUNT</Text>
                )}
              </TouchableOpacity>
            </View>
            <View className="flex items-center  justify-center mt-12">
              <Text className="text-xl">
                Already have an account?{" "}
                <Link
                  href="/Login"
                  className="font-rubik-extrabold font-bold text-blue-950"
                >
                  Login here
                </Link>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
