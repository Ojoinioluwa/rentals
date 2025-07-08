import icons from "@/constants/icons";
import images from "@/constants/images";
import { loginAction } from "@/redux/slice/authSlice";
import { LoginAPI } from "@/services/User/userServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { Link, router } from "expo-router";
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
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

// TODO: add login functions
// TODO: add the correct icons for the text field
const validationSchema = Yup.object({
  email: Yup.string().required("Email is required").email("Email is invalid"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const dispatch = useDispatch();

  const [passvisible, setPassVisible] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: LoginAPI,
  });

  const handleLogin = () => {
    formik.handleSubmit();
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      mutateAsync(values)
        .then((response) => {
          AsyncStorage.setItem(
            "user",
            JSON.stringify({
              token: response.token, // Save the token for future authenticated requests
              user: {
                id: response.user.id,
                name: response.user.name,
                email: response.user.email,
              },
            })
          );

          dispatch(loginAction(response));
          Toast.show({
            type: "success",
            text1: response.message,
            text2: "Welcome Back 👋",
          });
          formik.resetForm();
          setTimeout(() => {
            router.replace("/");
          }, 1500);
        })
        .catch((error) => {
          console.log("An Error occured", error);
          Toast.show({
            type: "error",
            text1: "Login Failed",
            text2: error.message,
          });
        });
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
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
          <KeyboardAvoidingView behavior="padding" className="">
            <View className="p-5 mt-2">
              {/* Email */}
              <View className="w-full py-3 px-4 bg-gray-50 rounded-full mb-5 flex-row items-center">
                <Image source={icons.send} className="w-5 h-5" />
                <TextInput
                  editable={!isPending}
                  autoCapitalize="none"
                  autoComplete="email"
                  placeholder="📧 Enter your Email here"
                  placeholderTextColor="gray"
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
              <View className="w-full py-3 px-4 bg-gray-50 rounded-full mb-2 flex-row items-center">
                <Image source={icons.shield} className="w-5 h-5" />
                <TextInput
                  editable={!isPending}
                  autoCapitalize="none"
                  placeholder="🔑 Enter your password here"
                  placeholderTextColor="gray"
                  className="text-sm font-rubik text-black-300 ml-2"
                  style={{ flex: 1 }}
                  secureTextEntry
                  onChangeText={formik.handleChange("password")}
                  onBlur={formik.handleBlur("password")}
                  value={formik.values.password}
                />
                <TouchableOpacity
                  onPress={() => setPassVisible(!passvisible)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Image
                    source={passvisible ? icons.eye : icons.eyeOff}
                    className="size-6 mr-5"
                  />
                </TouchableOpacity>
              </View>
              {/* <View className='bg-white py-3 rounded-full flex flex-row items-center mb-6'>
                    <Image source={icons.shield} className='size-5 ml-5' />
                    <TextInput
                      editable={!isPending}
                      // secureTextEntry={!passvisible}
                      placeholderTextColor="gray"
                      placeholder='🔑 Password'
                      className='font-rubix-medium flex-1'
                      onChangeText={formik.handleChange("password")}
                      onBlur={formik.handleBlur("password")}
                    />
                    <TouchableOpacity
                      onPress={() => setPassVisible(!passvisible)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Image
                        source={passvisible ? icons.eye : icons.eyeOff}
                        className='size-6 mr-5'
                      />
                    </TouchableOpacity>
                  </View> */}
              {formik.touched.password && formik.errors.password && (
                <Text className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </Text>
              )}

              {/* forgot passowrd */}
              <View className="flex  items-end">
                <Link
                  href="/ForgotPassword"
                  className="font-rubik-extrabold font-bold text-base "
                >
                  Forgot password?
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
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
