import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Define a placeholder image URL for a house
const HOUSE_IMAGE_URL =
  "https://placehold.co/300x300/60A5FA/FFFFFF?text=Your%20Dream%20Home";

const LandingPage: React.FC = () => {
  // Instantiate the router
  const router = useRouter();

  useEffect(() => {
    // Checks if the user is in storage to prevent logging in every time the user uses the application
    const checkUser = async () => {
      try {
        // Gets the user info from AsyncStorage
        const user = await AsyncStorage.getItem("user");
        if (user) {
          // User exists - go to home
          router.replace("/");
        }
      } catch (error) {
        console.error("Error checking user:", error);
      }
    };

    checkUser();
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      {" "}
      {/* Changed background to a lighter blue */}
      <View className="flex-1 px-5 pt-10 items-center justify-center">
        {/* Displayed header text for the landing page */}
        <Text className="text-center text-[40px] text-blue-800 font-bold mb-6">
          {" "}
          {/* Adjusted text color to match theme */}
          Discover Your Perfect Rental Home
        </Text>

        {/* Image container */}
        <View className="justify-center items-center py-5">
          {/* The landing image */}
          <Image
            source={{ uri: HOUSE_IMAGE_URL }}
            className="h-[300px] w-[300px] rounded-full border-4 border-blue-400" // Added border for visual appeal
            resizeMode="cover"
            onError={(e) =>
              console.log("Image loading error:", e.nativeEvent.error)
            } // Error handling for image
          />
        </View>

        {/* Button to redirect the user to the register page */}
        <TouchableOpacity
          onPress={() => {
            router.push("/Register");
          }}
          className="bg-blue-600 px-2 py-5 rounded-lg w-full flex items-center mt-10 shadow-md" // Darker blue for primary button
        >
          <Text className="text-white font-semibold text-2xl">Get Started</Text>
        </TouchableOpacity>

        {/* Button to redirect the user to the login page */}
        <TouchableOpacity
          onPress={() => router.push("/Login")}
          className="px-2 py-5 rounded-lg border-2 border-blue-600 flex items-center mt-5 w-full shadow-md" // Blue border for secondary button
        >
          <Text className="text-blue-600 font-semibold text-2xl">Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LandingPage;
