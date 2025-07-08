import { PropertyCard, propertyTypes } from "@/components/PropertyCard";
import { getMyProperties } from "@/services/landlord/landlordServices";
import { Property } from "@/types/property.types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeInUp,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// Main MyPropertiesScreen Component
const MyPropertiesScreen: React.FC = () => {
  // const [properties, setProperties] = useState<Property[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const router = useRouter();

  // Filter states
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [isAvailableFilter, setIsAvailableFilter] = useState<
    boolean | undefined
  >(undefined);
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>("");
  const [bedroomsFilter, setBedroomsFilter] = useState<string>("");
  const [bathroomsFilter, setBathroomsFilter] = useState<string>("");
  const [toiletsFilter, setToiletsFilter] = useState<string>("");
  const [furnishedFilter, setFurnishedFilter] = useState<boolean | undefined>(
    undefined
  );

  const queryKey = [
    "my-properties",
    page,
    limit,
    isAvailableFilter,
    propertyTypeFilter,
    bedroomsFilter,
    bathroomsFilter,
    toiletsFilter,
    furnishedFilter,
  ];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () =>
      getMyProperties({
        page,
        limit,
        isAvailable: isAvailableFilter,
        propertyType: propertyTypeFilter || undefined,
        numOfBedroom: bedroomsFilter ? Number(bedroomsFilter) : undefined,
        numOfBathroom: bathroomsFilter ? Number(bathroomsFilter) : undefined,
        numOfToilets: toiletsFilter ? Number(toiletsFilter) : undefined,
        isFurnished: furnishedFilter,
      }),
    // keepPreviousData: true, // prevents UI flicker between page changes
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
    filterHeight.value = withTiming(showFilters ? 0 : 600, {
      // Max height for filter section
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
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

  const handlePropertyPress = (propertyId: string) => {
    router.push({
      pathname: "/PropertyDetails",
      params: {
        id: propertyId,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50 pb-12">
      <ScrollView className="flex-1 p-5">
        {/* Header */}
        <Text className="text-center text-blue-800 text-3xl font-bold mb-4">
          My Properties
        </Text>
        <Text className="text-center text-gray-600 text-base mb-6">
          Manage your listed properties and their availability.
        </Text>

        {/* Filter Section Toggle */}
        <TouchableOpacity
          onPress={toggleFilterVisibility}
          className="bg-blue-500 py-3 rounded-xl flex-row items-center justify-center mb-4 shadow-md"
        >
          <Text className="text-white text-lg font-semibold mr-2">
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Text>
          <Text className="text-white text-xl">{showFilters ? "▲" : "▼"}</Text>
        </TouchableOpacity>

        {/* Filter Section */}
        <Animated.View
          style={filterAnimatedStyle}
          className="overflow-hidden bg-white p-5 rounded-xl shadow-md mb-6"
        >
          <View
            className="h-full"
            onLayout={(event) => {
              if (showFilters && filterHeight.value === 0) {
                filterHeight.value = event.nativeEvent.layout.height;
              }
            }}
          >
            <Text className="text-blue-700 text-xl font-bold mb-4">
              Filter Properties
            </Text>

            {/* Property Type Filter */}
            <View className="mb-4">
              <Text className="text-gray-700 text-base font-semibold mb-2">
                Property Type
              </Text>
              <View className="flex-row flex-wrap">
                {propertyTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() =>
                      setPropertyTypeFilter(
                        propertyTypeFilter === type ? "" : type
                      )
                    }
                    className={`px-3 py-2 m-1 rounded-full border ${
                      propertyTypeFilter === type
                        ? "bg-blue-100 border-blue-500"
                        : "bg-gray-100 border-gray-300"
                    }`}
                    disabled={isLoading}
                  >
                    <Text
                      className={`text-sm font-medium capitalize ${
                        propertyTypeFilter === type
                          ? "text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Availability Filter */}
            <View className="flex-row items-center justify-between py-3 px-4 bg-white rounded-xl border border-blue-200 mb-4">
              <Text className="text-gray-700 text-base font-semibold">
                Is Available?
              </Text>
              <Switch
                trackColor={{ false: "#E0E0E0", true: "#60A5FA" }}
                thumbColor={isAvailableFilter ? "#2563EB" : "#F4F4F4"}
                ios_backgroundColor="#E0E0E0"
                onValueChange={(value) => setIsAvailableFilter(value)}
                value={isAvailableFilter}
                disabled={isLoading}
              />
            </View>

            {/* Furnished Filter */}
            <View className="flex-row items-center justify-between py-3 px-4 bg-white rounded-xl border border-blue-200 mb-4">
              <Text className="text-gray-700 text-base font-semibold">
                Is Furnished?
              </Text>
              <Switch
                trackColor={{ false: "#E0E0E0", true: "#60A5FA" }}
                thumbColor={furnishedFilter ? "#2563EB" : "#F4F4F4"}
                ios_backgroundColor="#E0E0E0"
                onValueChange={(value) => setFurnishedFilter(value)}
                value={furnishedFilter}
                disabled={isLoading}
              />
            </View>

            {/* Number Inputs for Rooms */}
            <View className="flex-row justify-between mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-gray-700 text-base font-semibold mb-2">
                  Bedrooms
                </Text>
                <TextInput
                  className="bg-white py-3 px-4 rounded-xl border border-blue-200 text-gray-800 text-base"
                  placeholder="Any"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={bedroomsFilter}
                  onChangeText={setBedroomsFilter}
                  editable={!isLoading}
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-gray-700 text-base font-semibold mb-2">
                  Bathrooms
                </Text>
                <TextInput
                  className="bg-white py-3 px-4 rounded-xl border border-blue-200 text-gray-800 text-base"
                  placeholder="Any"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={bathroomsFilter}
                  onChangeText={setBathroomsFilter}
                  editable={!isLoading}
                />
              </View>
            </View>
            <View className="flex-row justify-between mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-gray-700 text-base font-semibold mb-2">
                  Toilets
                </Text>
                <TextInput
                  className="bg-white py-3 px-4 rounded-xl border border-blue-200 text-gray-800 text-base"
                  placeholder="Any"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={toiletsFilter}
                  onChangeText={setToiletsFilter}
                  editable={!isLoading}
                />
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
        </Animated.View>

        {/* Loading and Error States */}
        {isLoading ? (
          <View className="flex-1 justify-center items-center py-10">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="text-blue-700 mt-4 text-lg">
              Loading Properties...
            </Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center py-10">
            {/* <Text className="text-red-500 text-lg text-center">{error}</Text> */}
            <TouchableOpacity
              onPress={() => refetch}
              className="bg-blue-600 py-3 px-6 rounded-lg mt-4"
            >
              <Text className="text-white text-base">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : data?.properties.length === 0 ? (
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-600 text-lg text-center">
              No properties found matching your criteria.
            </Text>
            <Text className="text-gray-500 text-base mt-2">
              Try adjusting your filters or adding new properties.
            </Text>
            <TouchableOpacity
              onPress={() => console.log("Navigate to Add Property")}
              className="bg-blue-600 py-3 px-6 rounded-lg mt-4"
            >
              <Text className="text-white text-base">Add New Property</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Property List */}
            <Text className="text-blue-700 text-xl font-bold mb-4">
              Your Listings ({data?.totalProperties})
            </Text>
            {data.properties.map((property: Property, index: number) => (
              <Animated.View
                key={property._id}
                entering={FadeInUp.delay(index * 50).duration(500)} // Staggered entrance animation
                exiting={FadeOutDown.duration(300)}
              >
                <PropertyCard
                  property={property}
                  onPress={() => handlePropertyPress(property._id)}
                />
              </Animated.View>
            ))}

            {/* Pagination Controls */}
            <View className="flex-row justify-between items-center mt-6 mb-10">
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
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyPropertiesScreen;
