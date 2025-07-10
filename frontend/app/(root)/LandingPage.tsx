import images from "@/constants/images";
import getUserFromStorage from "@/utils/getUserFromStorage";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"; // Import ImageBackground and StyleSheet
import { SafeAreaView } from "react-native-safe-area-context";

const LandingPage: React.FC = () => {
  // Instantiate the router
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await getUserFromStorage();
        console.log(userData);

        console.log(userData?.user?.role);
        const role = userData?.user?.role;

        if (role === "landlord") {
          router.replace("/indexLandlord");
        } else if (role === "renter") {
          router.replace("/indexTenant");
        }
        //  else {
        //   router.replace("/RoleSelection");
        // }
      } catch (error) {
        console.error("Error checking user:", error);
      }
    };

    checkUser();
  }, [router]);

  return (
    <ImageBackground
      source={images.House}
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      {/* Added a semi-transparent overlay for better text readability */}
      <View className="flex-1 bg-black/50">
        <SafeAreaView className="flex-1">
          <View className="flex-1 px-5 pt-10 items-center justify-center">
            {/* Displayed header text for the landing page */}
            <Text className="text-center text-[40px] text-white font-bold mb-6">
              Discover Your Perfect Rental Home
            </Text>

            {/* Subtitle/tagline for more enticement */}
            <Text className="text-center text-lg text-white mb-10 opacity-80">
              Find your next dream home with ease and confidence. Your ideal
              living space awaits!
            </Text>

            {/* Removed the circular image as it's now the background */}

            {/* Button to redirect the user to the register page */}
            <TouchableOpacity
              onPress={() => {
                router.push("/RoleSelection");
              }}
              className="bg-blue-600 px-2 py-5 rounded-lg w-full flex items-center mt-10 shadow-lg" // Darker blue for primary button, added shadow
            >
              <Text className="text-white font-semibold text-2xl">
                Get Started
              </Text>
            </TouchableOpacity>

            {/* Button to redirect the user to the login page */}
            <TouchableOpacity
              onPress={() => router.push("/Login")}
              className="px-2 py-5 rounded-lg border-2 border-blue-400 flex items-center mt-5 w-full shadow-lg" // Blue border for secondary button, added shadow
            >
              <Text className="text-blue-400 font-semibold text-2xl">
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
  },
});

export default LandingPage;
