import { FormInput } from "@/components/PropertyCard";
import { BookingSchema } from "@/schemas/schemas";
import { createBooking } from "@/services/bookings/bookingsService";
import { BookingFormValues } from "@/types/Booking.types";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Animated, {
  Easing,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message"; // For displaying messages

const CreateBookingScreen: React.FC = () => {
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const { id } = useLocalSearchParams() as { id: string };

  const propertyId = id;
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["createBooking", propertyId],
    mutationFn: createBooking,
  });

  const formik = useFormik<BookingFormValues>({
    initialValues: {
      message: "",
      rentStart: null as Date | null,
      rentEnd: null as Date | null,
    },
    validationSchema: BookingSchema,
    onSubmit: async (values) => {
      if (!values.rentStart || !values.rentEnd) {
        Toast.show({
          type: "error",
          text1: "Please select both rent start and end dates.",
        });
        return;
      }
      console.log("Booking form values submitted:", values);
      try {
        const response = await mutateAsync({
          propertyId,
          message: values.message,
          rentStart: values.rentStart,
          rentEnd: values.rentEnd,
        });
        Toast.show({
          type: "success",
          text1: response.message,
        });
        formik.resetForm(); // Clear form on success
        router.back();
      } catch (error: any) {
        Toast.show({
          type: "error",
          text1: error.message || "An error occurred during booking.",
        });
      }
    },
  });

  // Date Picker Handlers
  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const handleConfirmStartDate = (date: Date) => {
    formik.setFieldValue("rentStart", date);
    hideStartDatePicker();
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const handleConfirmEndDate = (date: Date) => {
    formik.setFieldValue("rentEnd", date);
    hideEndDatePicker();
  };

  // Animation for the main content
  const contentOpacity = useSharedValue(0);
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
    };
  });

  useEffect(() => {
    contentOpacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.ease,
    });
  }, [contentOpacity]);

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <ScrollView className="flex-1 p-5">
        {/* Header */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(500)}
          className="flex-row items-center justify-between mb-6"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-blue-600 p-3 rounded-full shadow-lg"
          >
            <Text className="text-white text-xl">⬅️</Text>
          </TouchableOpacity>
          <Text className="text-blue-800 text-2xl font-bold flex-1 text-center pr-10">
            Book Property
          </Text>
        </Animated.View>

        <Animated.View style={contentAnimatedStyle} className="flex-1">
          <Text className="text-center text-gray-600 text-base mb-8">
            Fill in the details to request a booking for this property.
          </Text>

          {/* Booking Details */}
          <View className="bg-white p-5 rounded-xl shadow-md mb-6">
            <Text className="text-blue-700 text-xl font-bold mb-4">
              Booking Details
            </Text>

            <FormInput
              label="Your Message (Optional)"
              placeholder="e.g., I'm interested in viewing the property next week."
              value={formik.values.message}
              onChangeText={formik.handleChange("message")}
              onBlur={formik.handleBlur("message")}
              error={formik.errors.message}
              touched={formik.touched.message}
              multiline
              numberOfLines={4}
              editable={!isPending}
              icon={<Text className="text-blue-600 text-lg">✉️</Text>}
            />

            {/* Rent Start Date */}
            <View className="mb-4">
              <Text className="text-gray-700 text-base font-semibold mb-2">
                Rent Start Date
              </Text>
              <TouchableOpacity
                onPress={showStartDatePicker}
                className="bg-white py-3 px-4 rounded-xl flex-row items-center border border-blue-200"
                disabled={isPending}
              >
                <Text className="text-blue-600 text-lg mr-3">📅</Text>
                <Text className="flex-1 text-gray-800 text-base">
                  {formik.values.rentStart
                    ? formik.values.rentStart.toLocaleDateString()
                    : "Select Start Date"}
                </Text>
              </TouchableOpacity>
              {formik.touched.rentStart && formik.errors.rentStart && (
                <Text className="text-red-500 text-sm mt-1 ml-2">
                  {formik.errors.rentStart}
                </Text>
              )}
            </View>

            {/* Rent End Date */}
            <View className="mb-4">
              <Text className="text-gray-700 text-base font-semibold mb-2">
                Rent End Date
              </Text>
              <TouchableOpacity
                onPress={showEndDatePicker}
                className="bg-white py-3 px-4 rounded-xl flex-row items-center border border-blue-200"
                disabled={isPending}
              >
                <Text className="text-blue-600 text-lg mr-3">🗓️</Text>
                <Text className="flex-1 text-gray-800 text-base">
                  {formik.values.rentEnd
                    ? formik.values.rentEnd.toLocaleDateString()
                    : "Select End Date"}
                </Text>
              </TouchableOpacity>
              {formik.touched.rentEnd && formik.errors.rentEnd && (
                <Text className="text-red-500 text-sm mt-1 ml-2">
                  {formik.errors.rentEnd}
                </Text>
              )}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={() => formik.handleSubmit()}
            className="bg-blue-600 py-4 rounded-xl flex-row items-center justify-center shadow-md mb-10"
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-lg font-bold">
                Submit Booking Request
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Date Pickers */}
        <DateTimePickerModal
          isVisible={isStartDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmStartDate}
          onCancel={hideStartDatePicker}
          minimumDate={new Date()} // Cannot select past dates
        />
        <DateTimePickerModal
          isVisible={isEndDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmEndDate}
          onCancel={hideEndDatePicker}
          minimumDate={formik.values.rentStart || new Date()} // End date cannot be before start date
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateBookingScreen;
