import ActionLinkButton from "@/components/ActionButtonLink";
import {
  approveBooking,
  getBookingByLandlord,
  rejectBooking,
} from "@/services/bookings/bookingsService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

// Define types for populated fields based on your controller
interface LandlordDetails {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface TenantDetails {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface PropertyDetailsForBooking {
  _id: string;
  title: string;
  propertyType: string;
  description: string;
  images: string[];
  fees: {
    agency?: number;
    caution: number;
  };
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates: [number, number];
  };
}

// Define the type for a Booking, matching your Mongoose schema (with populated fields)
interface Booking {
  _id: string;
  property: PropertyDetailsForBooking;
  tenant: TenantDetails;
  landlord: LandlordDetails; // This would be the current landlord's details if populated
  message?: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  rentStart: Date;
  rentEnd: Date;
  isPaid: boolean;
  createdAt: Date;
}

const LandlordBookingDetailsScreen: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);
  const { id } = useLocalSearchParams() as { id: string };
  const router = useRouter();

  const bookingId = id;

  const queryClient = useQueryClient(); // Used for invalidating queries after mutations

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["LandlordsBooking", bookingId],
    queryFn: () => getBookingByLandlord(bookingId),
  });

  const booking = data?.booking;

  const [shouldFadeIn, setShouldFadeIn] = useState(false);

  const imageOpacity = useSharedValue(1);

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
  }));

  // Step 1: Named function to update state
  const updateImageIndex = (index: number) => {
    setCurrentImageIndex(index);
    setShouldFadeIn(true);
  };

  // Step 2: Wrap transition
  const switchImage = (newIndex: number) => {
    imageOpacity.value = withTiming(0, { duration: 150 }, () => {
      runOnJS(updateImageIndex)(newIndex);
    });
  };

  const handleNextImage = () => {
    if (!booking?.images?.length) return;
    const next = (currentImageIndex + 1) % booking.images.length;
    switchImage(next);
  };

  const handlePrevImage = () => {
    if (!booking?.images?.length) return;
    const prev =
      currentImageIndex === 0
        ? booking.images.length - 1
        : currentImageIndex - 1;
    switchImage(prev);
  };

  // Step 3: Fade back in after image is updated
  useEffect(() => {
    if (shouldFadeIn) {
      imageOpacity.value = withTiming(1, { duration: 150 });
      setShouldFadeIn(false);
    }
  }, [currentImageIndex, shouldFadeIn, imageOpacity]);

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "approved":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      case "cancelled":
        return "text-gray-500";
      default:
        return "text-gray-700";
    }
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["LandlordBookings"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["LandlordBookings"] });
    },
  });

  const handleApprove = async () => {
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

  const handleReject = async () => {
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

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-blue-50 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-blue-700 mt-4 text-lg">
          Loading Booking Details...
        </Text>
      </SafeAreaView>
    );
  }

  if (error || !booking) {
    return (
      <SafeAreaView className="flex-1 bg-blue-50 justify-center items-center p-5">
        <Text className="text-red-500 text-lg text-center mb-4">
          {error instanceof Error ? error.message : "Property not found."}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-blue-600 py-3 px-6 rounded-lg shadow-md"
        >
          <Text className="text-white text-base font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <ScrollView className="flex-1">
        {/* Back Button */}
        <Animated.View entering={FadeIn.delay(200).duration(500)}>
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-4 left-4 z-10 bg-blue-600 p-3 rounded-full shadow-lg"
          >
            <Text className="text-white text-xl">⬅️</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Property Image Carousel */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(600)}
          className="w-full h-72 bg-gray-200 relative"
        >
          {booking?.property?.images && booking.property?.images.length > 0 ? (
            <>
              <Animated.Image
                source={{ uri: booking?.property?.images[currentImageIndex] }}
                className="w-full h-full"
                resizeMode="cover"
                style={imageAnimatedStyle}
              />
              {booking?.property?.images.length > 1 && (
                <>
                  <TouchableOpacity
                    onPress={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-3 rounded-full"
                  >
                    <Text className="text-white text-lg">◀️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-3 rounded-full"
                  >
                    <Text className="text-white text-lg">▶️</Text>
                  </TouchableOpacity>
                  <View className="absolute bottom-2 left-0 right-0 flex-row justify-center">
                    {booking?.property?.images.map(
                      (_: string, index: number) => (
                        <View
                          key={index}
                          className={`w-2 h-2 rounded-full mx-1 ${
                            index === currentImageIndex
                              ? "bg-blue-500"
                              : "bg-gray-300"
                          }`}
                        />
                      )
                    )}
                  </View>
                </>
              )}
            </>
          ) : (
            <View className="w-full h-full justify-center items-center">
              <Text className="text-gray-500">
                No Property Images Available
              </Text>
            </View>
          )}
        </Animated.View>

        <View className="p-5">
          {/* Booking Summary */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(600)}
            className="bg-white p-4 rounded-xl shadow-md mb-4"
          >
            <Text className="text-blue-800 text-2xl font-bold mb-2">
              Booking for: {booking?.property?.title}
            </Text>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-600 text-base">Status:</Text>
              <Text
                className={`font-bold text-lg capitalize ${getStatusColor(
                  booking.status
                )}`}
              >
                {booking.status}
              </Text>
            </View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-600 text-base">Rent Period:</Text>
              <Text className="text-gray-800 font-semibold">
                {new Date(booking.rentStart).toLocaleDateString()} -{" "}
                {new Date(booking.rentEnd).toLocaleDateString()}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600 text-base">Payment Status:</Text>
              <Text
                className={`font-bold text-lg ${
                  booking.isPaid ? "text-green-600" : "text-red-600"
                }`}
              >
                {booking.isPaid ? "Paid" : "Pending"}
              </Text>
            </View>
          </Animated.View>

          {/* Tenant's Message */}
          {booking.message && (
            <Animated.View
              entering={FadeInUp.delay(500).duration(600)}
              className="bg-white p-4 rounded-xl shadow-md mb-4"
            >
              <Text className="text-blue-700 text-xl font-bold mb-2">
                Tenant&apos;s Message
              </Text>
              <Text className="text-gray-700 text-base leading-relaxed italic">
                &apos; {booking.message} &apos;
              </Text>
            </Animated.View>
          )}

          {/* Tenant Contact Info */}
          <Animated.View
            entering={FadeInUp.delay(600).duration(600)}
            className="bg-blue-100 p-4 rounded-xl shadow-md mb-4"
          >
            <Text className="text-blue-700 text-xl font-bold mb-2">
              Tenant Details
            </Text>
            <Text className="text-gray-700 text-base">
              Name: {booking.tenant.firstName} {booking.tenant.lastName}
            </Text>
            <Text className="text-gray-700 text-base mb-2">
              Email: {booking.tenant.email}
            </Text>
            <ActionLinkButton
              label="Message Tenant"
              type="email"
              destination={`${booking.tenant.email}`}
              icon={<Text className="text-green-600 text-2xl">✉️</Text>}
              description="Discuss details with tenant"
            />
          </Animated.View>

          {/* Property Details Snapshot */}
          <Animated.View
            entering={FadeInUp.delay(700).duration(600)}
            className="bg-white p-4 rounded-xl shadow-md mb-4"
          >
            <Text className="text-blue-700 text-xl font-bold mb-2">
              Property Information
            </Text>
            <Text className="text-gray-700 text-base mb-1">
              Type:{" "}
              <Text className="capitalize">
                {booking.property.propertyType}
              </Text>
            </Text>
            <Text className="text-gray-700 text-base mb-1">
              Description: {booking.property.description}
            </Text>
            <Text className="text-gray-700 text-base mb-1">
              Price: ₦{booking.property.price.toLocaleString()}
            </Text>
            <Text className="text-gray-700 text-base mb-1">
              Caution Fee: ₦{booking.property.fees.caution.toLocaleString()}
            </Text>
            {booking.property.fees.agency !== undefined && (
              <Text className="text-gray-700 text-base mb-1">
                Agency Fee: ₦{booking.property.fees.agency.toLocaleString()}
              </Text>
            )}
            <Text className="text-gray-700 text-base mt-2">Location:</Text>
            <Text className="text-gray-700 text-base ml-2">
              📍 {booking.property.location.address}
            </Text>
            <Text className="text-gray-700 text-base ml-2">
              🏙️ {booking.property.location.city},{" "}
              {booking.property.location.state}
            </Text>
            <Text className="text-gray-700 text-base ml-2">
              {booking.property.location.country}
            </Text>
          </Animated.View>

          {/* Landlord Action Buttons */}
          {booking.status === "pending" && (
            <Animated.View
              entering={FadeInUp.delay(800).duration(600)}
              className="flex-row justify-around mt-4 mb-10"
            >
              <TouchableOpacity
                onPress={() => handleApprove()}
                className="bg-green-500 py-3 px-6 rounded-lg shadow-md flex-1 mr-2"
                disabled={isProcessingAction}
              >
                {isProcessingAction ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white text-base font-semibold text-center">
                    Approve Booking
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleReject()}
                className="bg-red-500 py-3 px-6 rounded-lg shadow-md flex-1 ml-2"
                disabled={isProcessingAction}
              >
                {isProcessingAction ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white text-base font-semibold text-center">
                    Reject Booking
                  </Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LandlordBookingDetailsScreen;
