import { DetailItem } from "@/components/DetailItem";
import {
  Property,
  TenantPropertyDetailsScreenProps,
} from "@/types/property.types";
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
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const TenantPropertyDetailsScreen: React.FC<
  TenantPropertyDetailsScreenProps
> = ({ onGoBack, onBookNow }) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // ! TODO: Ensure to make changes this is just for demo
  const propertyId = "123344";

  // Animation for image carousel
  const imageOpacity = useSharedValue(1);
  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: imageOpacity.value,
    };
  });

  // Simulate fetching data for a single property (no landlord filter)
  useEffect(() => {
    const fetchSingleProperty = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulate API call with delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock data for a single property (accessible to any tenant)
        if (propertyId === "123344") {
          setProperty({
            _id: "123344",
            title: "Modern City Loft",
            description:
              "A stylish and compact loft apartment in a vibrant city center. Ideal for young professionals seeking convenience and urban living.",
            propertyType: "studio",
            bedrooms: 0, // Studio
            bathrooms: 1,
            toilets: 1,
            furnished: true,
            price: 250000,
            billingCycle: "monthly",
            fees: { agency: 15000, caution: 30000 },
            features: ["Electricity", "Water Supply", "Security", "Elevator"],
            images: [
              "https://placehold.co/600x400/ADD8E6/000000?text=Loft%20Interior",
              "https://placehold.co/600x400/87CEEB/000000?text=Kitchenette",
              "https://placehold.co/600x400/4682B4/FFFFFF?text=Bathroom",
            ],
            location: {
              address: "Unit 5, Urban Residences",
              city: "Lagos",
              state: "Lagos State",
              country: "Nigeria",
              coordinates: [3.3958, 6.5412],
            },
            isAvailable: true,
            availableFrom: new Date("2025-08-15T00:00:00Z"),
            landlord: {
              _id: "landlord-xyz",
              firstName: "Michael",
              lastName: "Brown",
              email: "michael.brown@example.com",
            },
          });
        } else {
          setError("Property not found.");
        }

        // // Actual useQuery implementation (uncomment and replace with your API)
        // const response = await fetch(`/api/property/${propertyId}`); // No landlord filter here
        // if (!response.ok) {
        //   throw new Error('Failed to fetch property details');
        // }
        // const data = await response.json();
        // setProperty(data.property);
        // Toast.show({ type: 'success', text1: data.message });
      } catch (err: any) {
        setError(err.message || "Failed to load property details.");
        // Toast.show({ type: 'error', text1: err.message || 'Failed to load property details.' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSingleProperty();
  }, [propertyId]);

  const handleNextImage = () => {
    if (property && property.images.length > 0) {
      imageOpacity.value = withTiming(0, { duration: 150 }, () => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % property.images.length
        );
        imageOpacity.value = withTiming(1, { duration: 150 });
      });
    }
  };

  const handlePrevImage = () => {
    if (property && property.images.length > 0) {
      imageOpacity.value = withTiming(0, { duration: 150 }, () => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
        );
        imageOpacity.value = withTiming(1, { duration: 150 });
      });
    }
  };

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
          {error || "Property not found."}
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
          {property.images && property.images.length > 0 ? (
            <>
              <Animated.Image
                source={{ uri: property.images[currentImageIndex] }}
                className="w-full h-full"
                resizeMode="cover"
                style={imageAnimatedStyle}
              />
              {property.images.length > 1 && (
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
                    {property.images.map((_, index) => (
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
                ₦{property.price.toLocaleString()}
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
                value={`₦${property.fees.caution.toLocaleString()}`}
              />
              {property.fees.agency !== undefined && (
                <DetailItem
                  icon="🏢"
                  label="Agency Fee"
                  value={`₦${property.fees.agency.toLocaleString()}`}
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
                {property.features.map((feature, index) => (
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
              📍 {property.location.address}
            </Text>
            <Text className="text-gray-700 text-base mb-1">
              🏙️ {property.location.city}, {property.location.state}
            </Text>
            <Text className="text-gray-700 text-base">
              🌍 {property.location.country}
            </Text>
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
              Name: {property.landlord.firstName} {property.landlord.lastName}
            </Text>
            <Text className="text-gray-700 text-base">
              Email: {property.landlord.email}
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

          {/* Book Now Button */}
          {property.isAvailable && onBookNow && (
            <Animated.View
              entering={FadeInUp.delay(1100).duration(600)}
              className="mb-10"
            >
              <TouchableOpacity
                onPress={() => onBookNow(property._id)}
                className="bg-green-500 py-4 rounded-xl flex-row items-center justify-center shadow-md"
              >
                <Text className="text-white text-lg font-bold mr-2">
                  Book Now
                </Text>
                <Text className="text-white text-xl">➡️</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
          {!property.isAvailable && (
            <Animated.View
              entering={FadeInUp.delay(1100).duration(600)}
              className="mb-10"
            >
              <View className="bg-red-100 border border-red-400 p-4 rounded-xl items-center justify-center">
                <Text className="text-red-700 text-lg font-bold">
                  Property Currently Not Available
                </Text>
                <Text className="text-red-600 text-sm mt-1">
                  Please check back later or explore other listings.
                </Text>
              </View>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TenantPropertyDetailsScreen;
