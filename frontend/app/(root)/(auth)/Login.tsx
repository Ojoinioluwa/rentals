import icons from "@/constants/icons";
import images from "@/constants/images";
import { loginAction } from "@/redux/slice/authSlice";
import { LoginAPI } from "@/services/User/userServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { useFormik } from "formik";
import React, { useState } from "react";

import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string().required("Email is required").email("Email is invalid"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [passVisible, setPassVisible] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: LoginAPI,
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await mutateAsync(values);
        console.log(values);
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({
            token: response.token, // Save the token for future authenticated requests
            user: {
              id: response.user.id,
              name: `${response.user.firstName} ${response.user.lastName}`,
              role: response.user.role,
              email: response.user.email,
            },
          })
        );

        const role = response?.user?.role;
        console.log(role);

        dispatch(loginAction({ ...response, role }));

        setTimeout(() => {
          if (role === "renter") {
            router.replace("/indexTenant");
          } else if (role === "landlord") {
            router.replace("/indexLandlord");
          } else {
            // fallback or error handling
            Toast.show({
              type: "error",
              text1: "Unknown role",
            });
          }
        }, 500);
      } catch (error: any) {
        // console.log("An Error occurred", error);
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: error.message,
        });
      }
    },
  });

  const handleLogin = () => {
    formik.handleSubmit();
  };

  return (
    <SafeAreaView className="h-[100vh] bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView className="bg-white">
          <View className="px-2 pt-10">
            {/* Login Image */}
            <Image
              source={images.Login}
              resizeMode="contain"
              className="w-full h-[300]"
            />
            <Text className="font-rubik-bold text-3xl text-center font-bold mt-5">
              Welcome Back!
            </Text>
            <Text className="font-rubix-light text-gray-400 text-center mt-2 text-xl">
              Login into your existing account
            </Text>
            {/* form section */}
            <View className="p-5 mt-2">
              {/* Email */}
              <View className="w-full py-3 px-4 bg-gray-50 rounded-full mb-5 flex-row items-center">
                <Image source={icons.info} className="w-5 h-5" />
                <TextInput
                  editable={!isPending}
                  autoCapitalize="none"
                  autoComplete="email"
                  placeholder="📧 Enter your Email here"
                  placeholderTextColor="black"
                  className="text-sm font-rubik text-black-300 ml-2"
                  style={{ flex: 1 }}
                  onChangeText={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
                  value={formik.values.email}
                />
              </View>
              {formik.touched.email && formik.errors.email && (
                <Text className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </Text>
              )}
              {/* password */}
              <View className="w-full py-3 px-4 bg-gray-50 rounded-full mb-5 flex-row items-center">
                <Image source={icons.info} className="size-5 ml-5" />
                <TextInput
                  editable={!isPending}
                  secureTextEntry={!passVisible}
                  placeholder="🔑 Password"
                  placeholderTextColor="black"
                  onChangeText={formik.handleChange("password")}
                  onBlur={formik.handleBlur("password")}
                  value={formik.values.password}
                  style={{
                    fontSize: 14,
                    color: "#000",
                    marginLeft: 8,
                    backgroundColor: "#fff", // just to be safe
                    padding: 10,
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
                <Text className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </Text>
              )}

              {/* forgot password */}
              <View className="flex items-end">
                <Link
                  href="/ForgotPassword"
                  className="font-rubik-extrabold font-bold text-base "
                >
                  <Text className="font-rubik-extrabold font-bold text-base ">
                    Forgot password?
                  </Text>
                </Link>
                <Link
                  href="/VerifyEmail"
                  className="font-rubik-extrabold font-bold text-base "
                >
                  <Text className="font-rubik-extrabold font-bold text-base ">
                    Verify Email?
                  </Text>
                </Link>
              </View>
              {/* login button */}
              <View className="flex justify-center items-center mt-3">
                <TouchableOpacity
                  disabled={isPending}
                  className="px-3 py-4 rounded-3xl  w-full mt-3 bg-blue-950"
                  onPress={handleLogin}
                >
                  {isPending ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-rubik-extrabold text-lg text-center">
                      Login
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
