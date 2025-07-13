import { DetailItem } from "@/components/DetailItem";
import { getPropertyById } from "@/services/landlord/landlordServices";
import { useQuery } from "@tanstack/react-query";
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
import { AnimatedView } from "./UploadImages";
import MapScreen from "@/components/MapScreen";

const PropertyDetailsScreen: React.FC = () => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [shouldFadeIn, setShouldFadeIn] = useState(false);
  const { id } = useLocalSearchParams() as { id: string };

  // Animation for image carousel
  const imageOpacity = useSharedValue(1);
  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: imageOpacity.value,
    };
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["property", id],
    queryFn: () => getPropertyById(id),
    enabled: !!id,
  });

  const property = data?.property;

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
    if (!property?.images?.length) return;
    const next = (currentImageIndex + 1) % property.images.length;
    switchImage(next);
  };

  const handlePrevImage = () => {
    if (!property?.images?.length) return;
    const prev =
      currentImageIndex === 0
        ? property.images.length - 1
        : currentImageIndex - 1;
    switchImage(prev);
  };

  // Step 3: Fade back in after image is updated
  useEffect(() => {
    if (shouldFadeIn) {
      imageOpacity.value = withTiming(1, { duration: 150 });
      setShouldFadeIn(false);
    }
  }, [currentImageIndex, imageOpacity, shouldFadeIn]);

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
        <AnimatedView entering={FadeIn.delay(200).duration(500)}>
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-4 left-4 z-10 bg-blue-600 p-3 rounded-full shadow-lg"
          >
            <Text className="text-white text-xl">⬅️</Text>
          </TouchableOpacity>
        </AnimatedView>

        {/* Property Image Carousel */}
        <AnimatedView
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
        </AnimatedView>

        <View className="p-5">
          {/* Title and Price */}
          <AnimatedView
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
          </AnimatedView>

          {/* Description */}
          <AnimatedView
            entering={FadeInUp.delay(500).duration(600)}
            className="bg-white p-4 rounded-xl shadow-md mb-4"
          >
            <Text className="text-blue-700 text-xl font-bold mb-2">
              Description
            </Text>
            <Text className="text-gray-700 text-base leading-relaxed">
              {property.description}
            </Text>
          </AnimatedView>

          {/* Key Details */}
          <AnimatedView
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
          </AnimatedView>

          {/* Fees */}
          <AnimatedView
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
          </AnimatedView>

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <AnimatedView
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
            </AnimatedView>
          )}

          {/* Location */}
          <AnimatedView
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
          </AnimatedView>

          <AnimatedView
            entering={FadeInUp.delay(900).duration(600)}
            className="bg-white p-4 rounded-xl shadow-md mb-4"
          >
            <View className="h-[250px] bg-green-100">
              <MapScreen
                latitude={property?.location.coordinates.coordinates[1]}
                longitude={property?.location.coordinates.coordinates[0]}
              />
            </View>
          </AnimatedView>

          <AnimatedView
            entering={FadeInUp.delay(300).duration(500)}
            className="bg-white p-5 rounded-2xl shadow-lg mb-6 flex-row space-x-3 justify-between gap-2"
          >
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/LandlordComponents/UploadImages",
                  params: { id },
                })
              }
              className="flex-1 bg-blue-700 py-3 rounded-xl flex-row items-center justify-center shadow-md"
            >
              <Text className="text-white text-base font-semibold mr-2">
                Upload Images
              </Text>
              <Text className="text-white text-xl">📤</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/LandlordComponents/EditProperty",
                  params: { id },
                })
              }
              className="flex-1 bg-gray-100 py-3 rounded-xl flex-row items-center justify-center shadow-sm border border-gray-300"
            >
              <Text className="text-blue-800 text-base font-semibold mr-2">
                Edit Property
              </Text>
              <Text className="text-blue-800 text-xl">✏️</Text>
            </TouchableOpacity>
          </AnimatedView>

          {/*  Landlord Info  this is not needed for the landlord he will be the one recieving mails from other users*/}
          {/* <AnimatedView
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
            <Text className="text-gray-700 text-base mb-4">
              Email: {property?.landlord?.email}
            </Text>

            <ActionLinkButton
              label="Message Landlord"
              type="email"
              destination="support@yourdomain.com"
              icon={<Text className="text-green-600 text-2xl">✉️</Text>}
              description="Send a Message to the landlord"
            />
          </AnimatedView> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PropertyDetailsScreen;
