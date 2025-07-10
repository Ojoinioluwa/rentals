import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message"; // Import Toast

const ChangePassword: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Show the "Feature Coming Soon" toast when the component mounts
    Toast.show({
      type: "info", // Can be 'success', 'error', 'info', or custom types
      text1: "Feature Coming Soon!",
      text2: "Password change functionality is under development.",
      position: "top", // 'top' or 'bottom'
      visibilityTime: 4000, // How long the toast stays visible (in milliseconds)
      autoHide: true,
      topOffset: 50, // Offset from the top of the screen
    });
  }, []); // Run only once when the component mounts

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 items-center justify-center p-5">
        <View className="bg-white rounded-xl p-8 shadow-lg items-center max-w-sm w-full">
          <Text className="text-3xl font-bold text-blue-700 mb-4 text-center">
            Change Password
          </Text>
          <Text className="text-gray-600 text-base mb-8 text-center">
            This feature is currently under construction. Please check back
            later!
          </Text>

          {/* Optional: A button to go back */}
          <TouchableOpacity
            className="bg-blue-600 py-3 px-6 rounded-lg shadow-md mt-4"
            onPress={() => router.back()}
          >
            <Text className="text-white text-lg font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;
