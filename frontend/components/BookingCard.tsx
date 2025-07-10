import {
  Booking,
  LandlordBookingCardProps,
  PropertyForBooking,
} from "@/types/Booking.types";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import ActionLinkButton from "./ActionButtonLink";

export const LandlordBookingCard: React.FC<LandlordBookingCardProps> = ({
  booking,
  onPressDetails,
  onApprove,
  onReject,
  onMessageTenant,
  isProcessing = false,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 10, stiffness: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
  };

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

  return (
    <Animated.View style={animatedStyle} className="w-full mb-4">
      <TouchableOpacity
        onPress={() => onPressDetails(booking._id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100"
      >
        {booking.property.images && booking.property.images.length > 0 ? (
          <Image
            source={{ uri: booking.property.images[0] }}
            className="w-full h-40"
            resizeMode="cover"
            onError={(e) =>
              console.log("Image loading error:", e.nativeEvent.error)
            }
          />
        ) : (
          <View className="w-full h-40 bg-gray-200 justify-center items-center">
            <Text className="text-gray-500">No Property Image</Text>
          </View>
        )}
        <View className="p-4">
          <Text className="text-xl font-bold text-blue-800 mb-2">
            {booking.property.title}
          </Text>
          <Text className="text-gray-700 text-base mb-2" numberOfLines={2}>
            {booking.property.description}
          </Text>

          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-blue-600 font-semibold">Status:</Text>
            <Text
              className={`font-bold capitalize ${getStatusColor(
                booking.status
              )}`}
            >
              {booking.status}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-blue-600 font-semibold">Rent Period:</Text>
            <Text className="text-gray-700">
              {new Date(booking.rentStart).toLocaleDateString()} -{" "}
              {new Date(booking.rentEnd).toLocaleDateString()}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-blue-600 font-semibold">Tenant:</Text>
            <Text className="text-gray-700 font-semibold">
              {booking.tenant.firstName} {booking.tenant.lastName}
            </Text>
          </View>
          <Text className="text-gray-500 text-sm mb-2">
            Email: {booking.tenant.email}
          </Text>

          {booking.message && (
            <View className="mt-2 p-2 bg-blue-50 rounded-lg">
              <Text className="text-gray-600 text-sm italic" numberOfLines={2}>
                &quot; {booking.message} &quot;
              </Text>
            </View>
          )}

          {/* Landlord Actions for Pending Bookings */}
          {booking.status === "pending" && (
            <View className="flex-row justify-around mt-4 mb-3">
              <TouchableOpacity
                onPress={() => onApprove && onApprove(booking._id)}
                className="bg-green-500 py-2 px-4 rounded-lg shadow-sm flex-1 mr-2"
                disabled={isProcessing}
              >
                <Text className="text-white font-semibold text-center">
                  Approve
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onReject && onReject(booking._id)}
                className="bg-red-500 py-2 px-4 rounded-lg shadow-sm flex-1 ml-2"
                disabled={isProcessing}
              >
                <Text className="text-white font-semibold text-center">
                  Reject
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {booking.status === "pending" && (
            <ActionLinkButton
              label="Email Support"
              type="email"
              destination={`${booking.tenant.email}`}
              icon={<Text className="text-green-600 text-2xl">✉️</Text>}
              description="Send us a detailed message"
            />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Define the type for a Booking, matching your Mongoose schema (with populated property)
interface Bookings {
  _id: string;
  property: PropertyForBooking; // Populated property details
  tenant: string; // Tenant ID (assuming current user)
  landlord: string; // Landlord ID
  message?: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  rentStart: Date;
  rentEnd: Date;
  isPaid: boolean;
  createdAt: Date;
}

interface BookingCardProps {
  booking: Bookings;
  onPress: (bookingId: string) => void;
  onCancel: (bookingId: string) => void;
  isProcessing: boolean;
}
export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onPress,
  onCancel,
  isProcessing,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 10, stiffness: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
  };

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

  return (
    <Animated.View style={animatedStyle} className="w-full mb-4">
      <TouchableOpacity
        onPress={() => onPress(booking._id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100"
      >
        {booking.property.images && booking.property.images.length > 0 ? (
          <Image
            source={{ uri: booking.property.images[0] }}
            className="w-full h-40"
            resizeMode="cover"
            onError={(e) =>
              console.log("Image loading error:", e.nativeEvent.error)
            }
          />
        ) : (
          <View className="w-full h-40 bg-gray-200 justify-center items-center">
            <Text className="text-gray-500">No Property Image</Text>
          </View>
        )}
        <View className="p-4">
          <Text className="text-xl font-bold text-blue-800 mb-2">
            {booking.property.title}
          </Text>
          <Text className="text-gray-700 text-base mb-2" numberOfLines={2}>
            {booking.property.description}
          </Text>

          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-blue-600 font-semibold">Status:</Text>
            <Text
              className={`font-bold capitalize ${getStatusColor(
                booking.status
              )}`}
            >
              {booking.status}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-blue-600 font-semibold">Rent Start:</Text>
            <Text className="text-gray-700">
              {new Date(booking.rentStart).toLocaleDateString()}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-blue-600 font-semibold">Rent End:</Text>
            <Text className="text-gray-700">
              {new Date(booking.rentEnd).toLocaleDateString()}
            </Text>
          </View>

          {booking.message && (
            <View className="mt-2 p-2 bg-blue-50 rounded-lg">
              <Text className="text-gray-600 text-sm italic" numberOfLines={2}>
                &quot; {booking.message} &quot;
              </Text>
            </View>
          )}

          {booking.status === "pending" && (
            <View className="flex-row justify-around mt-4">
              <TouchableOpacity
                onPress={() => onCancel && onCancel(booking._id)}
                className="bg-red-500 py-2 px-4 rounded-lg shadow-sm flex-1 mr-2"
                disabled={isProcessing}
              >
                <Text className="text-white font-semibold text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
