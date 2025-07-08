import React from "react";
import { Text, View } from "react-native";

interface DetailItemProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string; // Tailwind color class for value
}

export const DetailItem: React.FC<DetailItemProps> = ({
  icon,
  label,
  value,
  color,
}) => (
  <View className="w-1/2 px-2 mb-3">
    <View className="flex-row items-center">
      <Text className="text-lg mr-2">{icon}</Text>
      <View>
        <Text className="text-gray-500 text-sm">{label}</Text>
        <Text
          className={`text-gray-800 text-base font-semibold ${color || ""}`}
        >
          {value}
        </Text>
      </View>
    </View>
  </View>
);
