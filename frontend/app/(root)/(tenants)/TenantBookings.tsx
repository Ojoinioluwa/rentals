import { BookingCard } from "@/components/BookingCard";
import {
  cancelBooking,
  getMyBookings,
} from "@/services/bookings/bookingsService";
import { PropertyForBooking } from "@/types/Booking.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
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
import { AnimatedView } from "../LandlordComponents/UploadImages";

interface Booking {
  _id: string;
  property: PropertyForBooking;
  tenant: string;
  landlord: string;
  message?: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  rentStart: Date;
  rentEnd: Date;
  isPaid: boolean;
  createdAt: Date;
}

// Main MyBookingsScreen Component
const MyBookingsScreen: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);

  // Filter states
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [status, setStatus] = useState<Booking["status"] | "">("");

  // router details
  const router = useRouter();

  const allowedStatuses: Booking["status"][] = [
    "pending",
    "approved",
    "rejected",
    "cancelled",
  ];

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["TenantBookings", status, page],
    queryFn: () => getMyBookings(status, page, limit),
  });

  const bookings = data?.bookings;

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

  useEffect(() => {
    setTotalBookings(data?.totalBookings);
    setTotalPages(data?.totalPages);
  }, [data]);

  const { mutateAsync: cancel } = useMutation({
    mutationKey: ["rejectBooking"],
    mutationFn: cancelBooking,
    onError: (err: any) => {
      Toast.show({
        type: "error",
        text1: err.message || "Failed to update booking status.",
      });
      setIsProcessingAction(false);
    },
  });

  const onCancel = async (bookingId: string) => {
    setIsProcessingAction(true);
    await cancel(bookingId);
    setTimeout(() => {
      Toast.show({
        type: "success",
        text1: "Booking Cancelled Successfully",
      });
      setIsProcessingAction(false);
      refetch();
    }, 1000);
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

  const handleBookingPress = (bookingId: string) => {
    router.push({
      pathname: "/TenantComponents/BookingDetailsTenant",
      params: { id: bookingId },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50 pb-12">
      <ScrollView className="flex-1 p-5">
        {/* Header */}
        <AnimatedView
          entering={FadeInUp.delay(100).duration(500)}
          className="mb-4"
        >
          <Text className="text-center text-blue-800 text-3xl font-bold mb-2">
            My Bookings
          </Text>
          <Text className="text-center text-gray-600 text-base">
            View and manage your property booking requests.
          </Text>
        </AnimatedView>

        {/* Filter Section Toggle */}
        <AnimatedView entering={FadeInUp.delay(200).duration(500)}>
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
        </AnimatedView>

        {/* Filter Section */}
        <AnimatedView
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
                  disabled={isLoading}
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
                    disabled={isLoading}
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
              disabled={isLoading}
            >
              <Text className="text-white text-lg font-semibold">
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </AnimatedView>

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
              {error instanceof Error ? error.message : "Bookings not found."}
            </Text>
            <TouchableOpacity
              onPress={() => refetch()}
              className="bg-blue-600 py-3 px-6 rounded-lg mt-4"
            >
              <Text className="text-white text-base">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : bookings?.length === 0 ? (
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-600 text-lg text-center">
              No bookings found matching your criteria.
            </Text>
            <Text className="text-gray-500 text-base mt-2">
              Try adjusting your filters or creating new bookings.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/ListProperties")}
              className="bg-blue-600 py-3 px-6 rounded-lg mt-4"
            >
              <Text className="text-white text-base">Create New Booking</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Booking List */}
            <AnimatedView entering={FadeInUp.delay(300).duration(500)}>
              <Text className="text-blue-700 text-xl font-bold mb-4">
                Your Booking Requests ({totalBookings})
              </Text>
            </AnimatedView>
            {bookings.map((booking: Booking, index: number) => (
              <AnimatedView
                key={booking._id}
                entering={FadeInUp.delay(index * 50 + 400).duration(500)} // Staggered entrance animation
                exiting={FadeOutDown.duration(300)}
                layout={Layout.springify()} // Smooth layout changes
              >
                <BookingCard
                  booking={booking}
                  onPress={handleBookingPress}
                  onCancel={onCancel}
                  isProcessing={isProcessingAction}
                />
              </AnimatedView>
            ))}

            {/* Pagination Controls */}
            <AnimatedView
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
                disabled={page === 1 || isLoading}
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
                disabled={page === totalPages || isLoading}
              >
                <Text className="text-white font-semibold">Next</Text>
              </TouchableOpacity>
            </AnimatedView>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyBookingsScreen;
