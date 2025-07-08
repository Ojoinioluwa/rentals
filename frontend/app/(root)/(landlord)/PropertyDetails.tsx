import { DetailItem } from "@/components/DetailItem";
import { getPropertyById } from "@/services/landlord/landlordServices";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
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

const PropertyDetailsScreen: React.FC = () => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const { id } = useLocalSearchParams() as { id: string };
  console.log(id);

  // Animation for image carousel
  const imageOpacity = useSharedValue(1);
  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: imageOpacity.value,
    };
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["property", id],
    queryFn: () => getPropertyById(id),
    enabled: !!id,
  });

  const property = data?.property;

  const handleNextImage = () => {
    if (property && property.images.length > 0) {
      imageOpacity.value = withTiming(0, { duration: 150 }, () => {
        runOnJS(setCurrentImageIndex)(
          (prevIndex) => (prevIndex + 1) % property.images.length
        );
        imageOpacity.value = withTiming(1, { duration: 150 });
      });
    }
  };

  const handlePrevImage = () => {
    if (property && property.images.length > 0) {
      imageOpacity.value = withTiming(0, { duration: 150 }, () => {
        runOnJS(setCurrentImageIndex)((prevIndex) =>
          prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
        );
        imageOpacity.value = withTiming(1, { duration: 150 });
      });
    }
  };

  console.log("🖼️ Image URL:", property?.images[currentImageIndex]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-blue-50 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-blue-700 mt-4 text-lg">
          Loading Property Details...
        </Text>
      </SafeAreaView>
    );
  }

  if (error || !property) {
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
    <SafeAreaView className="flex-1 bg-blue-50 pb-10">
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
          {property?.images && property?.images?.length > 0 ? (
            <>
              <Animated.Image
                source={{ uri: property?.images[currentImageIndex] }}
                className="w-full h-full"
                resizeMode="cover"
                style={imageAnimatedStyle}
              />
              {property?.images.length > 1 && (
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
                    {property?.images.map((_: string, index: number) => (
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
              <Text className="text-gray-500">No Images Available</Text>
            </View>
          )}
        </Animated.View>

        <View className="p-5">
          {/* Title and Price */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(600)}
            className="flex-row justify-between items-start mb-4"
          >
            <View className="flex-1 pr-4">
              <Text className="text-blue-800 text-3xl font-bold">
                {property.title}
              </Text>
              <Text className="text-gray-600 text-base mt-1 capitalize">
                {property.propertyType}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-green-600 text-3xl font-bold">
                ₦{property.price}
              </Text>
              <Text className="text-gray-500 text-base">
                per {property.billingCycle}
              </Text>
            </View>
          </Animated.View>

          {/* Description */}
          <Animated.View
            entering={FadeInUp.delay(500).duration(600)}
            className="bg-white p-4 rounded-xl shadow-md mb-4"
          >
            <Text className="text-blue-700 text-xl font-bold mb-2">
              Description
            </Text>
            <Text className="text-gray-700 text-base leading-relaxed">
              {property.description}
            </Text>
          </Animated.View>

          {/* Key Details */}
          <Animated.View
            entering={FadeInUp.delay(600).duration(600)}
            className="bg-white p-4 rounded-xl shadow-md mb-4"
          >
            <Text className="text-blue-700 text-xl font-bold mb-2">
              Key Details
            </Text>
            <View className="flex-row flex-wrap -mx-2">
              <DetailItem
                icon="🛏️"
                label="Bedrooms"
                value={property.bedrooms}
              />
              <DetailItem
                icon="🚿"
                label="Bathrooms"
                value={property.bathrooms}
              />
              <DetailItem icon="🚽" label="Toilets" value={property.toilets} />
              <DetailItem
                icon="🛋️"
                label="Furnished"
                value={property.furnished ? "Yes" : "No"}
              />
              <DetailItem
                icon="🗓️"
                label="Available From"
                value={
                  property.availableFrom
                    ? new Date(property.availableFrom).toLocaleDateString()
                    : "N/A"
                }
              />
              <DetailItem
                icon="✅"
                label="Status"
                value={property.isAvailable ? "Available" : "Not Available"}
                color={property.isAvailable ? "text-green-500" : "text-red-500"}
              />
            </View>
          </Animated.View>

          {/* Fees */}
          <Animated.View
            entering={FadeInUp.delay(700).duration(600)}
            className="bg-white p-4 rounded-xl shadow-md mb-4"
          >
            <Text className="text-blue-700 text-xl font-bold mb-2">Fees</Text>
            <View className="flex-row flex-wrap -mx-2">
              <DetailItem
                icon="🛡️"
                label="Caution Fee"
                value={`₦${property.fees?.caution.toLocaleString()}`}
              />
              {property.fees?.agency !== undefined && (
                <DetailItem
                  icon="🏢"
                  label="Agency Fee"
                  value={`₦${property.fees?.agency.toLocaleString()}`}
                />
              )}
            </View>
          </Animated.View>

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <Animated.View
              entering={FadeInUp.delay(800).duration(600)}
              className="bg-white p-4 rounded-xl shadow-md mb-4"
            >
              <Text className="text-blue-700 text-xl font-bold mb-2">
                Features
              </Text>
              <View className="flex-row flex-wrap">
                {property.features.map((feature: string, index: number) => (
                  <View
                    key={index}
                    className="bg-blue-100 rounded-full px-3 py-1 m-1"
                  >
                    <Text className="text-blue-700 text-sm">{feature}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Location */}
          <Animated.View
            entering={FadeInUp.delay(900).duration(600)}
            className="bg-white p-4 rounded-xl shadow-md mb-4"
          >
            <Text className="text-blue-700 text-xl font-bold mb-2">
              Location
            </Text>
            <Text className="text-gray-700 text-base mb-1">
              📍 {property?.location?.address}
            </Text>
            <Text className="text-gray-700 text-base mb-1">
              🏙️ {property.location?.city}, {property.location?.state}
            </Text>
            <Text className="text-gray-700 text-base">
              {property?.location?.country}
            </Text>
            {/*  TODO: embed the mao that is need for to make the project more bulky and pleasing to the eye*/}
            {/* You could embed a map component here using the coordinates */}
          </Animated.View>

          {/* Landlord Info */}
          <Animated.View
            entering={FadeInUp.delay(1000).duration(600)}
            className="bg-blue-100 p-4 rounded-xl shadow-md mb-6"
          >
            <Text className="text-blue-700 text-xl font-bold mb-2">
              Contact Landlord
            </Text>
            <Text className="text-gray-700 text-base">
              Name: {property?.landlord?.firstName}{" "}
              {property?.landlord?.lastName}
            </Text>
            <Text className="text-gray-700 text-base">
              Email: {property?.landlord?.email}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PropertyDetailsScreen;
