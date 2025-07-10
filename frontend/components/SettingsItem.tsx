import { SettingItemProps } from "@/types/settings.types";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  onPress,
  isLast = false,
  children,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
  };

  return (
    <Animated.View style={animatedStyle} className="w-full">
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1} // Control the default opacity change
        className={`flex-row items-center justify-between py-4 px-5 bg-white ${
          !isLast ? "border-b border-blue-100" : ""
        }`}
      >
        <View className="flex-row items-center">
          {/* Placeholder for Icon - In a real app, you'd use a library like @expo/vector-icons */}
          <View className="w-6 h-6 mr-4 flex items-center justify-center">
            {icon ? icon : <Text className="text-blue-600 text-lg">⚙️</Text>}
          </View>
          <Text className="text-lg text-gray-800 font-medium">{title}</Text>
        </View>
        {children || (
          <Text className="text-gray-400 text-xl">›</Text> // Chevron icon
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export const SettingsHeader = () => {
  return (
    <View className="bg-blue-600 py-8 px-5 rounded-b-3xl shadow-lg">
      <Text className="text-white text-3xl font-bold mb-2">Settings</Text>
      <Text className="text-blue-100 text-base">
        Manage your preferences and account.
      </Text>
    </View>
  );
};

export const SettingsProfile = ({
  name,
  email,
  profileImage,
}: {
  name: string;
  email: string;
  profileImage?: string | null; // Optional prop
}) => {
  const [imageError, setImageError] = useState(false);

  const router = useRouter();

  // Get initials (e.g., John Doe → JD)
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0]; // Fallback if single name
  };

  // Final image URL logic
  const initials = getInitials(name || "User").toUpperCase();
  const fallbackAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials
  )}&background=ADD8E6&color=000000&size=80`;

  const displayImage =
    !imageError && profileImage
      ? { uri: profileImage }
      : { uri: fallbackAvatarUrl };

  return (
    <View className="bg-white mx-4 mt-6 p-5 rounded-xl shadow-md flex-row items-center">
      <Image
        source={displayImage}
        onError={() => setImageError(true)}
        className="w-20 h-20 rounded-full border-2 border-blue-300"
      />
      <View className="ml-4">
        <Text className="text-xl font-bold text-gray-800">
          {name || "John Doe"}
        </Text>
        <Text className="text-gray-500">{email || "john.doe@example.com"}</Text>
        <TouchableOpacity
          className="mt-2"
          onPress={() => router.push("/Profile")}
        >
          <Text className="text-blue-500 font-semibold">View Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
