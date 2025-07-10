import { logOutAction } from "@/redux/slice/authSlice";
import { GetProfileAPI } from "@/services/User/userServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query"; // Import useQueryClient
import { useRouter } from "expo-router"; // For navigation
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

// --- Profile Page Component ---
const ProfilePage: React.FC = () => {
  const router = useRouter();
  //   const queryClient = useQueryClient(); // Initialize useQueryClient
  const dispatch = useDispatch();
  const logoutOutHandler = async () => {
    dispatch(logOutAction());
    await AsyncStorage.removeItem("user");
    router.replace("/LandingPage");
  };

  // Fetch user data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userProfile"],
    queryFn: GetProfileAPI,
  });

  const user = data?.user;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg text-gray-600">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (isError || !user) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-red-50">
        <Text className="text-lg text-red-700">
          Error loading profile. Please try again.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}>
        {/* Header Section */}
        <View className="items-center py-8 bg-blue-100 rounded-b-3xl mb-5 shadow-lg">
          {/* Avatar Section */}
          <View className="w-32 h-32 rounded-full bg-white border-4 border-blue-400 items-center justify-center mb-4 relative">
            <Image
              source={{
                uri: "https://via.placeholder.com/150/F87171/FFFFFF?text=JD",
              }}
              className="w-28 h-28 rounded-full resize-cover"
            />
            <TouchableOpacity
              onPress={() => router.push("/EditProfile")}
              className="absolute bottom-1 right-1 bg-blue-500 rounded-full p-2 px-3"
            >
              <Text className="text-white text-xs font-semibold">Edit</Text>
            </TouchableOpacity>
          </View>

          {/* User Name & Type */}
          <Text className="text-gray-900 text-3xl font-bold mb-1">
            {user.firstName} {user.lastName}
          </Text>
          <Text className="text-blue-600 text-base font-semibold bg-blue-100 px-3 py-1 rounded-full overflow-hidden">
            {user.userType === "landlord"
              ? "Landlord Account"
              : "Renter Account"}
          </Text>
        </View>

        {/* --- Account Information Section --- */}
        <View className="bg-white rounded-xl mx-5 mb-5 px-5 py-4 shadow-md">
          <Text className="text-gray-900 text-xl font-bold mb-3 pb-2 border-b border-gray-100">
            Account Information
          </Text>
          <ProfileDetail label="Email" value={user.email} />
          <ProfileDetail label="Phone Number" value={user.phoneNumber} />
        </View>

        {/* --- Actions Section --- */}
        <View className="bg-white rounded-xl mx-5 mb-5 px-5 py-4 shadow-md">
          <Text className="text-gray-900 text-xl font-bold mb-3 pb-2 border-b border-gray-100">
            Actions
          </Text>
          <ProfileActionButton
            label="Edit Profile"
            onPress={() => router.push("/EditProfile")}
          />
          <ProfileActionButton
            label="Change Password"
            onPress={() => router.push("/ChangePassword")}
          />
        </View>

        {/* --- Logout Button --- */}
        <TouchableOpacity
          className="bg-red-500 py-4 rounded-xl mx-5 items-center mt-5 shadow-lg"
          onPress={logoutOutHandler}
        >
          <Text className="text-white text-lg font-bold">Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

interface ProfileDetailProps {
  label: string;
  value: string;
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({ label, value }) => (
  <View className="flex-row justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
    <Text className="text-gray-700 text-base font-medium">{label}</Text>
    <Text className="text-gray-800 text-base font-semibold">{value}</Text>
  </View>
);

interface ProfileActionButtonProps {
  label: string;
  onPress: () => void;
}

const ProfileActionButton: React.FC<ProfileActionButtonProps> = ({
  label,
  onPress,
}) => (
  <TouchableOpacity
    className="flex-row justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
    onPress={onPress}
  >
    <Text className="text-blue-600 text-base font-medium">{label}</Text>
    {/* Right arrow icon */}
    <Text className="text-gray-400 text-xl font-bold">{">"}</Text>
  </TouchableOpacity>
);

export default ProfilePage;
