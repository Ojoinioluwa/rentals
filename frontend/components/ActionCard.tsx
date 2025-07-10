import { AnimatedView } from "@/app/(root)/LandlordComponents/UploadImages";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface ActionCardProps {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
  delay?: number;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  description,
  onPress,
  delay = 0,
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
    <AnimatedView
      entering={FadeInUp.delay(delay).duration(600)}
      style={animatedStyle}
      className="w-full mb-4"
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        className="bg-white p-5 rounded-xl shadow-md border border-blue-100 flex-row items-center"
      >
        <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-4">
          <Text className="text-3xl">{icon}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-xl font-bold text-blue-800 mb-1">{title}</Text>
          <Text className="text-gray-600 text-sm">{description}</Text>
        </View>
      </TouchableOpacity>
    </AnimatedView>
  );
};
