import { LandlordBookingCard } from "@/components/BookingCard";
import {
  approveBooking,
  getLandlordBookings,
  rejectBooking,
} from "@/services/bookings/bookingsService";
import { Booking } from "@/types/Booking.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeInUp,
  FadeOutDown,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

// Main LandlordBookingsScreen Component
const LandlordBookingsScreen: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false); // For approve/reject actions

  // Filter states
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [status, setStatus] = useState<Booking["status"] | "">("");

  const router = useRouter();

  const allowedStatuses: Booking["status"][] = [
    "pending",
    "approved",
    "rejected",
    "cancelled",
  ];

  const {
    data: bookings,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["LandlordBookings", status],
    queryFn: () => getLandlordBookings(status, limit, page),
  });

  // Animation for filter section
  const filterHeight = useSharedValue(0);
  const filterAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: filterHeight.value,
      opacity: withTiming(showFilters ? 1 : 0, { duration: 200 }),
    };
  });

  const toggleFilterVisibility = () => {
    setShowFilters(!showFilters);
    filterHeight.value = withTiming(showFilters ? 0 : 250, {
      // Max height for filter section
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const { mutateAsync: approve } = useMutation({
    mutationKey: ["approveBooking"],
    mutationFn: approveBooking,
    onError: (err: any) => {
      Toast.show({
        type: "error",
        text1: err.message || "Failed to update booking status.",
      });
      setIsProcessingAction(false);
    },
  });
  const { mutateAsync: reject } = useMutation({
    mutationKey: ["rejectBooking"],
    mutationFn: rejectBooking,
    onError: (err: any) => {
      Toast.show({
        type: "error",
        text1: err.message || "Failed to update booking status.",
      });
      setIsProcessingAction(false);
    },
  });

  const handleApproveBooking = async (bookingId: string) => {
    setIsProcessingAction(true);
    await approve(bookingId);
    setTimeout(() => {
      Toast.show({
        type: "success",
        text1: "Booking Approved Successfully",
      });
      setIsProcessingAction(false);
      refetch();
    }, 1000);
  };

  const handleRejectBooking = async (bookingId: string) => {
    setIsProcessingAction(true);
    await reject(bookingId);

    setTimeout(() => {
      Toast.show({
        type: "success",
        text1: "Booking rejected successfully",
      });
      setIsProcessingAction(false);
      refetch();
    }, 1000);
  };

  const handleMessageTenant = (tenantEmail: string) => {
    Alert.alert(
      "Message Tenant",
      `Simulating messaging tenant: ${tenantEmail}`
    );
    // In a real app, this would open an email client or an in-app chat.
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    setTotalBookings(bookings?.length);
  }, [bookings]);

  const handleBookingDetailsPress = (bookingId: string) => {
    router.push({
      pathname: "/BookingDetailsLandlord",
      params: { id: bookingId },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50 pb-12">
      <ScrollView className="flex-1 p-5">
        {/* Header */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(500)}
          className="mb-4"
        >
          <Text className="text-center text-blue-800 text-3xl font-bold mb-2">
            Bookings Received
          </Text>
          <Text className="text-center text-gray-600 text-base">
            Review and manage booking requests for your properties.
          </Text>
        </Animated.View>

        {/* Filter Section Toggle */}
        <Animated.View entering={FadeInUp.delay(200).duration(500)}>
          <TouchableOpacity
            onPress={toggleFilterVisibility}
            className="bg-blue-500 py-3 rounded-xl flex-row items-center justify-center mb-4 shadow-md"
          >
            <Text className="text-white text-lg font-semibold mr-2">
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Text>
            <Text className="text-white text-xl">
              {showFilters ? "▲" : "▼"}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Filter Section */}
        <Animated.View
          style={filterAnimatedStyle}
          className="overflow-hidden bg-white p-5 rounded-xl shadow-md mb-6"
        >
          <View
            onLayout={(event) => {
              if (showFilters && filterHeight.value === 0) {
                filterHeight.value = event.nativeEvent.layout.height;
              }
            }}
          >
            <Text className="text-blue-700 text-xl font-bold mb-4">
              Filter Bookings
            </Text>

            {/* Status Filter */}
            <View className="mb-4">
              <Text className="text-gray-700 text-base font-semibold mb-2">
                Booking Status
              </Text>
              <View className="flex-row flex-wrap">
                <TouchableOpacity
                  onPress={() => setStatus("")}
                  className={`px-3 py-2 m-1 rounded-full border ${
                    status === ""
                      ? "bg-blue-100 border-blue-500"
                      : "bg-gray-100 border-gray-300"
                  }`}
                  disabled={isLoading || isProcessingAction}
                >
                  <Text
                    className={`text-sm font-medium ${
                      status === "" ? "text-blue-700" : "text-gray-700"
                    }`}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                {allowedStatuses.map((status) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() => setStatus(status === status ? "" : status)}
                    className={`px-3 py-2 m-1 rounded-full border ${
                      status === status
                        ? "bg-blue-100 border-blue-500"
                        : "bg-gray-100 border-gray-300"
                    }`}
                    disabled={isLoading || isProcessingAction}
                  >
                    <Text
                      className={`text-sm font-medium capitalize ${
                        status === status ? "text-blue-700" : "text-gray-700"
                      }`}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Apply Filters Button (Optional, can also apply on change) */}
            <TouchableOpacity
              onPress={() => setPage(1)} // Reset to first page on filter apply
              className="bg-blue-600 py-3 rounded-xl flex-row items-center justify-center mt-4 shadow-md"
              disabled={isLoading || isProcessingAction}
            >
              <Text className="text-white text-lg font-semibold">
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Loading and Error States */}
        {isLoading ? (
          <View className="flex-1 justify-center items-center py-10">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="text-blue-700 mt-4 text-lg">
              Loading Bookings...
            </Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-red-500 text-lg text-center">
              {error.message}
            </Text>
            <TouchableOpacity
              onPress={() => refetch()}
              className="bg-blue-600 py-3 px-6 rounded-lg mt-4"
            >
              <Text className="text-white text-base">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : bookings.length === 0 ? (
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-600 text-lg text-center">
              No booking requests received yet.
            </Text>
            <Text className="text-gray-500 text-base mt-2">
              Share your properties to get bookings!
            </Text>
          </View>
        ) : (
          <>
            {/* Booking List */}
            <Animated.View entering={FadeInUp.delay(300).duration(500)}>
              <Text className="text-blue-700 text-xl font-bold mb-4">
                Received Booking Requests ({totalBookings})
              </Text>
            </Animated.View>
            {bookings?.bookings?.map((booking: Booking, index: number) => (
              <Animated.View
                key={booking._id}
                entering={FadeInUp.delay(index * 50 + 400).duration(500)} // Staggered entrance animation
                exiting={FadeOutDown.duration(300)}
                layout={Layout.springify()} // Smooth layout changes
              >
                <LandlordBookingCard
                  booking={booking}
                  onPressDetails={handleBookingDetailsPress}
                  onApprove={handleApproveBooking}
                  onReject={handleRejectBooking}
                  onMessageTenant={handleMessageTenant}
                  isProcessing={isProcessingAction}
                />
              </Animated.View>
            ))}

            {/* Pagination Controls */}
            <Animated.View
              entering={FadeInUp.delay(bookings.length * 50 + 500).duration(
                500
              )}
              className="flex-row justify-between items-center mt-6 mb-10"
            >
              <TouchableOpacity
                onPress={handlePrevPage}
                className={`bg-blue-500 py-3 px-5 rounded-lg ${
                  page === 1 ? "opacity-50" : ""
                }`}
                disabled={page === 1 || isLoading || isProcessingAction}
              >
                <Text className="text-white font-semibold">Previous</Text>
              </TouchableOpacity>
              <Text className="text-gray-700 text-lg font-medium">
                Page {page} of {totalPages}
              </Text>
              <TouchableOpacity
                onPress={handleNextPage}
                className={`bg-blue-500 py-3 px-5 rounded-lg ${
                  page === totalPages ? "opacity-50" : ""
                }`}
                disabled={
                  page === totalPages || isLoading || isProcessingAction
                }
              >
                <Text className="text-white font-semibold">Next</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default LandlordBookingsScreen;
