import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert, // Using Alert for user feedback in this simulation
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useRouter } from "expo-router";

// Define a type for the language options
type LanguageCode = "en-US" | "en-GB";

interface LanguageSelectionScreenProps {
  onLanguageSelected: (language: LanguageCode) => void;
  onGoBack?: () => void; // Optional callback to navigate back
}

// Helper component for animated language cards
interface LanguageCardProps {
  flag: string;
  name: string;
  description: string;
  onPress: () => void;
  delay?: number;
  isSelected: boolean;
}

const LanguageCard: React.FC<LanguageCardProps> = ({
  flag,
  name,
  description,
  onPress,
  delay = 0,
  isSelected,
}) => {
  const scale = useSharedValue(1);
  const borderColor = useSharedValue(isSelected ? "#2563EB" : "#DBEAFE"); // blue-600 vs blue-100

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      borderColor: borderColor.value,
    };
  });

  // Update border color when isSelected prop changes
  React.useEffect(() => {
    borderColor.value = withTiming(isSelected ? "#2563EB" : "#DBEAFE", {
      duration: 200,
    });
  }, [isSelected, borderColor]);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(600)}
      style={[animatedStyle, styles.cardBorder]} // Apply animated border color
      className="w-full mb-6"
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        className="bg-white p-6 rounded-xl shadow-lg items-center"
      >
        <Text className="text-5xl mb-4">{flag}</Text>
        <Text className="text-2xl font-bold text-blue-800 mb-2">{name}</Text>
        <Text className="text-gray-600 text-base text-center leading-relaxed">
          {description}
        </Text>
        {isSelected && (
          <Animated.Text
            entering={FadeInUp.delay(100).duration(300)}
            className="mt-3 text-green-600 font-bold text-lg"
          >
            Selected
          </Animated.Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = () => {
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageCode>("en-GB");
  const router = useRouter();

  const handleLanguageSelect = (language: LanguageCode) => {
    setSelectedLanguage(language);
    Alert.alert(
      "Language Selected",
      `You have selected ${language === "en-US" ? "US English" : "UK English"}.`
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50 justify-center items-center p-5">
      {/* Back Button */}
      <Animated.View
        entering={FadeInUp.delay(100).duration(500)}
        className="absolute top-8 left-4 z-10"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-blue-600 p-3 rounded-full shadow-lg"
        >
          <Text className="text-white text-xl">⬅️</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(200).duration(500)}
        className="mb-10"
      >
        <Text className="text-center text-blue-800 text-3xl font-bold mb-3">
          Choose Your Language
        </Text>
        <Text className="text-center text-gray-600 text-base max-w-sm">
          Select your preferred English dialect for the app.
        </Text>
      </Animated.View>

      <View className="w-full max-w-md">
        <LanguageCard
          flag="🇺🇸"
          name="US English"
          description="Standard American English for a familiar experience."
          onPress={() => handleLanguageSelect("en-US")}
          delay={300}
          isSelected={selectedLanguage === "en-US"}
        />

        <LanguageCard
          flag="🇬🇧"
          name="UK English"
          description="Standard British English for a classic feel."
          onPress={() => handleLanguageSelect("en-GB")}
          delay={400}
          isSelected={selectedLanguage === "en-GB"}
        />
      </View>
    </SafeAreaView>
  );
};

export default LanguageSelectionScreen;

const styles = StyleSheet.create({
  cardBorder: {
    borderWidth: 2, // Tailwind's border-2
    borderRadius: 12, // Tailwind's rounded-xl
  },
});
