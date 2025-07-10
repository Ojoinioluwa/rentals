import { RoleCard } from "@/components/RoleCard";
import { setRole } from "@/redux/slice/authSlice";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { AnimatedView } from "../LandlordComponents/UploadImages";

// Define a type for the possible roles
export type UserRole = "renter" | "landlord";

const RoleSelection: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const onRoleSelected = (role: UserRole) => {
    dispatch(setRole({ role }));
    router.replace("/Register");
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50 justify-center items-center p-5">
      <AnimatedView
        entering={FadeInUp.delay(100).duration(500)}
        className="mb-10"
      >
        <Text className="text-center text-blue-800 text-3xl font-bold mb-3">
          Who are you?
        </Text>
        <Text className="text-center text-gray-600 text-base max-w-sm">
          Please select your role to get started with the app.
        </Text>
      </AnimatedView>

      <View className="w-full max-w-md">
        <RoleCard
          icon="🏠"
          title="I'm a Renter"
          description="Find your next home, browse properties, and manage your bookings."
          onPress={() => {
            onRoleSelected("renter");
            // console.log("Selected: Renter");
          }}
          delay={200}
        />

        <RoleCard
          icon="🔑"
          title="I'm a Landlord"
          description="List your properties, manage bookings, and communicate with tenants."
          onPress={() => {
            onRoleSelected("landlord");
            // console.log("Selected: Landlord");
          }}
          delay={400}
        />
      </View>
    </SafeAreaView>
  );
};

export default RoleSelection;
