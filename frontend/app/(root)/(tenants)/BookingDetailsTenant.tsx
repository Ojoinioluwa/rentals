import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
// import { useQuery } from '@tanstack/react-query'; // Commented out as requested
// import Toast from 'react-native-toast-message'; // For displaying messages

const { width } = Dimensions.get("window");

// Define types for populated fields based on your controller
interface LandlordDetails {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface PropertyDetailsForBooking {
  _id: string;
  title: string;
  propertyType: string;
  description: string; // Added description based on previous property types
  images: string[]; // Added images for display
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
  tenant: string;
  landlord: LandlordDetails;
  message?: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  rentStart: Date;
  rentEnd: Date;
  isPaid: boolean;
  createdAt: Date;
}

interface BookingDetailsScreenProps {
  bookingId: string; // The ID of the booking to display
  onGoBack?: () => void; // Optional callback to navigate back
}

// Helper component for detail items (reused from PropertyDetailsScreen)
interface DetailItemProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string; // Tailwind color class for value
}

const DetailItem: React.FC<DetailItemProps> = ({
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

const BookingDetailsScreen: React.FC<BookingDetailsScreenProps> = ({
  bookingId,
  onGoBack,
}) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Animation for image carousel
  const imageOpacity = useSharedValue(1);
  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: imageOpacity.value,
    };
  });

  // Simulate fetching data
  useEffect(() => {
    const fetchSingleBooking = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulate API call with delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock data for a single booking
        if (bookingId === "mock-booking-123") {
          setBooking({
            _id: "mock-booking-123",
            property: {
              _id: "prop-xyz",
              title: "Spacious Family Home",
              propertyType: "duplex",
              description:
                "A beautiful 4-bedroom duplex with a large garden, perfect for families. Located in a serene environment with excellent security.",
              images: [
                "https://placehold.co/600x400/ADD8E6/000000?text=House%20Front",
                "https://placehold.co/600x400/87CEEB/000000?text=Living%20Room",
                "https://placehold.co/600x400/4682B4/FFFFFF?text=Kitchen",
                "https://placehold.co/600x400/6A5ACD/FFFFFF?text=Bedroom",
              ],
              fees: { agency: 75000, caution: 100000 },
              price: 3000000,
              location: {
                address: "456 Garden Avenue",
                city: "Abuja",
                state: "FCT",
                country: "Nigeria",
                coordinates: [7.4913, 9.0722],
              },
            },
            tenant: "current-user-id",
            landlord: {
              _id: "landlord-abc",
              firstName: "Alice",
              lastName: "Johnson",
              email: "alice.johnson@example.com",
            },
            message:
              "Looking forward to viewing this property. Is it available for a long-term lease?",
            status: "pending", // Can be 'pending', 'approved', 'rejected', 'cancelled'
            rentStart: new Date("2025-09-01T00:00:00Z"),
            rentEnd: new Date("2026-08-31T00:00:00Z"),
            isPaid: false,
            createdAt: new Date("2025-07-01T10:00:00Z"),
          });
        } else {
          setError("Booking not found or you are not authorized to view it.");
        }

        // // Actual useQuery implementation (uncomment and replace with your API)
        // const response = await fetch(`/api/bookings/${bookingId}`);
        // if (!response.ok) {
        //   throw new Error('Failed to fetch booking details');
        // }
        // const data = await response.json();
        // setBooking(data.booking);
        // Toast.show({ type: 'success', text1: data.message });
      } catch (err: any) {
        setError(err.message || "Failed to load booking details.");
        // Toast.show({ type: 'error', text1: err.message || 'Failed to load booking details.' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSingleBooking();
  }, [bookingId]);

  const handleNextImage = () => {
    if (booking && booking.property.images.length > 0) {
      imageOpacity.value = withTiming(0, { duration: 150 }, () => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % booking.property.images.length
        );
        imageOpacity.value = withTiming(1, { duration: 150 });
      });
    }
  };

  const handlePrevImage = () => {
    if (booking && booking.property.images.length > 0) {
      imageOpacity.value = withTiming(0, { duration: 150 }, () => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === 0 ? booking.property.images.length - 1 : prevIndex - 1
        );
        imageOpacity.value = withTiming(1, { duration: 150 });
      });
    }
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
          {error || "Booking not found."}
        </Text>
        <TouchableOpacity
          onPress={onGoBack}
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
            onPress={onGoBack}
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
          {booking.property.images && booking.property.images.length > 0 ? (
            <>
              <Animated.Image
                source={{ uri: booking.property.images[currentImageIndex] }}
                className="w-full h-full"
                resizeMode="cover"
                style={imageAnimatedStyle}
              />
              {booking.property.images.length > 1 && (
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
                    {booking.property.images.map((_, index) => (
                      <View
                        key={index}
                        className={`w-2 h-2 rounded-full mx-1 ${
                          index === currentImageIndex
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
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
              Booking for: {booking.property.title}
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
                Your Message
              </Text>
              <Text className="text-gray-700 text-base leading-relaxed italic">
                "{booking.message}"
              </Text>
            </Animated.View>
          )}

          {/* Property Details Snapshot */}
          <Animated.View
            entering={FadeInUp.delay(600).duration(600)}
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
              � {booking.property.location.country}
            </Text>
          </Animated.View>

          {/* Landlord Info */}
          <Animated.View
            entering={FadeInUp.delay(700).duration(600)}
            className="bg-blue-100 p-4 rounded-xl shadow-md mb-6"
          >
            <Text className="text-blue-700 text-xl font-bold mb-2">
              Contact Landlord
            </Text>
            <Text className="text-gray-700 text-base">
              Name: {booking.landlord.firstName} {booking.landlord.lastName}
            </Text>
            <Text className="text-gray-700 text-base">
              Email: {booking.landlord.email}
            </Text>
            <TouchableOpacity
              onPress={() => console.log("Initiate contact with landlord")}
              className="bg-blue-600 py-3 rounded-lg flex-row items-center justify-center mt-4 shadow-md"
            >
              <Text className="text-white text-lg font-semibold mr-2">
                Message Landlord
              </Text>
              <Text className="text-white text-xl">✉️</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Action Buttons (e.g., Cancel Booking, Make Payment) */}
          <Animated.View
            entering={FadeInUp.delay(800).duration(600)}
            className="flex-row justify-around mb-10"
          >
            {booking.status === "pending" && (
              <TouchableOpacity
                onPress={() => console.log("Cancel Booking")}
                className="bg-red-500 py-3 px-6 rounded-lg shadow-md"
              >
                <Text className="text-white text-base font-semibold">
                  Cancel Booking
                </Text>
              </TouchableOpacity>
            )}
            {booking.status === "approved" && !booking.isPaid && (
              <TouchableOpacity
                onPress={() => console.log("Proceed to Payment")}
                className="bg-green-500 py-3 px-6 rounded-lg shadow-md"
              >
                <Text className="text-white text-base font-semibold">
                  Make Payment
                </Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingDetailsScreen;
