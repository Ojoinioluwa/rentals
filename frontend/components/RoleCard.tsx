import { AnimatedView } from "@/app/(root)/LandlordComponents/UploadImages";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

// Helper component for animated role selection cards
interface RoleCardProps {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
  delay?: number;
}

export const RoleCard: React.FC<RoleCardProps> = ({
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
      className="w-full mb-6"
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 items-center"
      >
        <View className="w-20 h-20 rounded-full bg-blue-100 items-center justify-center mb-4">
          <Text className="text-5xl">{icon}</Text>
        </View>
        <Text className="text-2xl font-bold text-blue-800 mb-2">{title}</Text>
        <Text className="text-gray-600 text-base text-center leading-relaxed">
          {description}
        </Text>
      </TouchableOpacity>
    </AnimatedView>
  );
};
