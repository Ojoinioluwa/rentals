import { ActionCard } from "@/components/ActionCard";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import Animated, { FadeInUp, Layout } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter } from 'expo-router'; // Uncomment if using Expo Router for navigation

// Helper component for animated action cards

const HomeScreen: React.FC = () => {
  const router = useRouter(); // Uncomment if using Expo Router

  const isLandlord = true;

  return (
    <SafeAreaView className="flex-1 bg-blue-50 pb-12">
      <ScrollView className="flex-1 p-5">
        {/* Header */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(500)}
          className="mb-6"
        >
          <Text className="text-center text-blue-800 text-3xl font-bold mb-2">
            Welcome to Rentals!
          </Text>
          <Text className="text-center text-gray-600 text-base">
            Your trusted partner for finding and managing properties.
          </Text>
        </Animated.View>
        {/* Content based on user role */}
        <Animated.View layout={Layout.springify()} className="flex-1">
          <Animated.View
            key="landlord-section"
            entering={FadeInUp.delay(300).duration(600)}
          >
            <Text className="text-blue-700 text-2xl font-bold mb-4">
              Landlord Dashboard
            </Text>
            <ActionCard
              icon="🏡"
              title="My Properties"
              description="View and manage your listed properties."
              onPress={() => router.push("/MyProperties")}
              delay={0}
            />
            <ActionCard
              icon="📬"
              title="Bookings Received"
              description="Review and respond to tenant booking requests."
              onPress={() => router.push("/LandlordBookings")}
              delay={100}
            />
            <ActionCard
              icon="➕"
              title="Add New Property"
              description="List a new property for rent."
              onPress={() => router.push("/AddProperty")}
              delay={200}
            />
          </Animated.View>
        </Animated.View>
        {/* General Settings/Info */}
        <Animated.View
          entering={FadeInUp.delay(isLandlord ? 600 : 500).duration(600)}
          className="mt-8"
        >
          <Text className="text-blue-700 text-2xl font-bold mb-4">General</Text>
          <ActionCard
            icon="⚙️"
            title="Settings"
            description="Adjust app preferences and profile."
            onPress={() => router.push("/Settings")}
            delay={0}
          />
          <ActionCard
            icon="❓"
            title="Help & Support"
            description="Get assistance or find answers to your questions."
            onPress={() => router.push("/HelpSupport")}
            delay={100}
          />
        </Animated.View>
        <View className="h-10" /> {/* Spacer for bottom */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
