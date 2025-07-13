import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert, // Using Alert for user feedback in this simulation
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeInUp,
  FadeIn,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface RateUsScreenProps {
  onGoBack?: () => void; // Optional callback to navigate back
}

const RateUsScreen: React.FC<RateUsScreenProps> = ({ onGoBack }) => {
  const [currentRating, setCurrentRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(
    null
  );

  const starScale1 = useSharedValue(1);
  const starScale2 = useSharedValue(1);
  const starScale3 = useSharedValue(1);
  const starScale4 = useSharedValue(1);
  const starScale5 = useSharedValue(1);

  const starScales = [
    starScale1,
    starScale2,
    starScale3,
    starScale4,
    starScale5,
  ];

  const starAnimatedStyles = [
    useAnimatedStyle(() => ({ transform: [{ scale: starScale1.value }] })),
    useAnimatedStyle(() => ({ transform: [{ scale: starScale2.value }] })),
    useAnimatedStyle(() => ({ transform: [{ scale: starScale3.value }] })),
    useAnimatedStyle(() => ({ transform: [{ scale: starScale4.value }] })),
    useAnimatedStyle(() => ({ transform: [{ scale: starScale5.value }] })),
  ];

  const handleStarPress = (rating: number) => {
    setCurrentRating(rating);
    setSubmissionMessage(null);
    Haptics.selectionAsync(); // ✨
  };

  // Function to simulate rating submission
  const handleSubmitRating = async () => {
    if (currentRating === 0) {
      Alert.alert(
        "No Rating",
        "Please select a star rating before submitting."
      );
      return;
    }

    setIsSubmitting(true);
    setSubmissionMessage(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success or failure
      if (Math.random() > 0.1) {
        // 90% success rate
        setSubmissionMessage(`Thank you for rating us ${currentRating} stars!`);
        Alert.alert("Rating Submitted", `You rated us ${currentRating} stars!`);
        setCurrentRating(0); // Reset rating after submission
      } else {
        throw new Error("Failed to submit rating. Please try again.");
      }
    } catch (error: any) {
      setSubmissionMessage(`Error: ${error.message}`);
      Alert.alert("Submission Failed", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50 justify-center items-center p-5">
      {/* Back Button */}
      <Animated.View
        entering={FadeInUp.delay(100).duration(500)}
        className="absolute top-8 left-4 z-10"
      >
        <TouchableOpacity
          onPress={onGoBack}
          className="bg-blue-600 p-3 rounded-full shadow-lg"
        >
          <Text className="text-white text-xl">⬅️</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(200).duration(600)}
        className="bg-white p-8 rounded-xl shadow-lg items-center max-w-md w-full"
      >
        <Text className="text-blue-800 text-3xl font-bold mb-4 text-center">
          Rate Our App!
        </Text>
        <Text className="text-gray-600 text-base mb-8 text-center leading-relaxed">
          We&apos;d love to hear your feedback. Please tap the stars to rate
          your experience.
        </Text>

        {/* Star Rating Section */}
        <View className="flex-row items-center justify-center mb-8">
          {[1, 2, 3, 4, 5].map((starValue, index) => (
            <TouchableOpacity
              key={starValue}
              onPress={() => handleStarPress(starValue)}
              onPressIn={() => {
                starScales[index].value = withSpring(1.2, {
                  damping: 10,
                  stiffness: 100,
                });
              }}
              onPressOut={() => {
                starScales[index].value = withSpring(1, {
                  damping: 10,
                  stiffness: 100,
                });
              }}
              disabled={isSubmitting}
            >
              <Animated.Text
                style={starAnimatedStyles[index]}
                className={`text-5xl mx-1 ${
                  starValue <= currentRating
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ⭐
              </Animated.Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Display current rating */}
        {currentRating > 0 && (
          <Animated.Text
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            className="text-blue-700 text-lg font-semibold mb-6"
          >
            You rated: {currentRating} Stars
          </Animated.Text>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmitRating}
          className="bg-blue-600 py-4 rounded-xl flex-row items-center justify-center shadow-md w-full"
          disabled={isSubmitting || currentRating === 0}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white text-lg font-bold">Submit Rating</Text>
          )}
        </TouchableOpacity>

        {/* Submission Message */}
        {submissionMessage && (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            className={`mt-6 p-3 rounded-lg w-full ${
              submissionMessage.startsWith("Thank you")
                ? "bg-green-100 border border-green-400"
                : "bg-red-100 border border-red-400"
            }`}
          >
            <Text
              className={`text-center text-base ${
                submissionMessage.startsWith("Thank you")
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {submissionMessage}
            </Text>
          </Animated.View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

export default RateUsScreen;
