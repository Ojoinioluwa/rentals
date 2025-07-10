import { useRouter } from "expo-router"; // For internal navigation
import React from "react";
import { Alert, Linking, Text, TouchableOpacity, View } from "react-native";

// Define the props interface for clarity and type safety
interface ActionLinkButtonProps {
  label: string; // The text displayed on the button
  type: "navigate" | "email" | "externalLink" | "call"; // Type of action
  destination: string; // The route path, email address, URL, or phone number
  icon?: React.ReactNode; // Optional icon to display (e.g., from react-native-vector-icons or a simple Text emoji)
  description?: string; // Optional descriptive text below the label
  className?: string; // Optional additional Tailwind CSS classes for the TouchableOpacity
  labelClassName?: string; // Optional additional Tailwind CSS classes for the label text
  descriptionClassName?: string; // Optional additional Tailwind CSS classes for the description text
}

const ActionLinkButton: React.FC<ActionLinkButtonProps> = ({
  label,
  type,
  destination,
  icon,
  description,
  className = "", // Default empty string for className
  labelClassName = "",
  descriptionClassName = "",
}) => {
  const router = useRouter();

  const handlePress = async () => {
    try {
      if (type === "navigate") {
        router.push(destination);
      } else if (type === "email") {
        await Linking.openURL(`mailto:${destination}`);
      } else if (type === "externalLink") {
        await Linking.openURL(destination);
      } else if (type === "call") {
        await Linking.openURL(`tel:${destination}`);
      }
    } catch (error: any) {
      console.error(`Failed to perform action for ${type}:`, error);
      Alert.alert(
        "Action Failed",
        `Could not complete the action. Please try again. Error: ${error.message}`
      );
    }
  };

  return (
    <TouchableOpacity
      className={`flex-row items-center bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-200 ${className}`}
      onPress={handlePress}
    >
      {icon && <View className="mr-3">{icon}</View>}
      <View className="flex-1">
        <Text
          className={`text-lg font-semibold text-gray-800 ${labelClassName}`}
        >
          {label}
        </Text>
        {description && (
          <Text
            className={`text-sm text-gray-500 mt-1 ${descriptionClassName}`}
          >
            {description}
          </Text>
        )}
      </View>
      {/* Optional arrow icon for visual indication of action */}
      <Text className="text-gray-400 text-xl font-bold ml-3">{">"}</Text>
    </TouchableOpacity>
  );
};

export default ActionLinkButton;
