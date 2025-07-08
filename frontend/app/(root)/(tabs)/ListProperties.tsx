import { PropertyCard, propertyTypes } from "@/components/PropertyCard";
import { Property } from "@/types/property.types";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
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
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
// import { useQuery } from '@tanstack/react-query'; // Commented out as requested
// import Toast from 'react-native-toast-message'; // For displaying messages

const { width } = Dimensions.get("window");

// Main AllPropertiesScreen Component
const AllPropertiesScreen: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProperties, setTotalProperties] = useState<number>(0);

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

  // Simulate fetching data based on controller logic
  const fetchAllProperties = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock data generation based on filters and pagination
      const allMockProperties: Property[] = Array.from(
        { length: 100 },
        (_, i) => ({
          _id: `all-prop-${i + 1}`,
          title: `Charming ${i % 2 === 0 ? "Studio" : "Apartment"} ${i + 1}`,
          description: `A lovely ${
            i % 2 === 0 ? "studio" : "apartment"
          } perfect for singles or couples.`,
          propertyType: ["studio", "apartment", "room", "self-contain"][
            i % 4
          ] as any,
          bedrooms: i % 2, // 0 or 1
          bathrooms: i % 2,
          toilets: (i % 2) + 1,
          furnished: i % 3 === 0,
          price: (i + 1) * 50000 + 50000,
          billingCycle: i % 2 === 0 ? "monthly" : "yearly",
          fees: { caution: (i + 1) * 2000 },
          features: ["Water Supply", "Electricity", "Parking"].slice(
            0,
            (i % 3) + 1
          ),
          images: [
            `https://placehold.co/300x200/ADD8E6/000000?text=Property%20${
              i + 1
            }`,
          ],
          location: {
            address: `${i + 100} Oak Lane`,
            city: ["Lagos", "Abuja", "Kano", "Ibadan"][i % 4],
            state: ["Lagos State", "FCT", "Kano State", "Oyo State"][i % 4],
            country: "Nigeria",
            coordinates: [3.3792 + i * 0.005, 6.5244 + i * 0.005],
          },
          isAvailable: i % 5 !== 0, // Simulate some unavailable properties
          availableFrom: new Date(),
          landlord: {
            _id: `landlord-${i % 5}`,
            email: `landlord${i % 5}@example.com`,
            firstName: `Landlord${i % 5}`,
            lastName: `User${i % 5}`,
          },
        })
      );

      let filteredMockProperties = allMockProperties.filter((prop) => {
        let match = true;
        if (
          isAvailableFilter !== undefined &&
          prop.isAvailable !== isAvailableFilter
        )
          match = false;
        if (propertyTypeFilter && prop.propertyType !== propertyTypeFilter)
          match = false;
        if (bedroomsFilter && prop.bedrooms !== Number(bedroomsFilter))
          match = false;
        if (bathroomsFilter && prop.bathrooms !== Number(bathroomsFilter))
          match = false;
        if (toiletsFilter && prop.toilets !== Number(toiletsFilter))
          match = false;
        if (furnishedFilter !== undefined && prop.furnished !== furnishedFilter)
          match = false;
        return match;
      });

      const totalFiltered = filteredMockProperties.length;
      const paginatedProperties = filteredMockProperties.slice(
        skip,
        skip + limit
      );

      setProperties(paginatedProperties);
      setTotalProperties(totalFiltered);
      setTotalPages(Math.ceil(totalFiltered / limit));

      // // Actual useQuery implementation (uncomment and replace with your API)
      // const response = await fetch(`/api/properties?page=${page}&limit=${limit}&isAvailable=${isAvailableFilter}&propertyType=${propertyTypeFilter}&bedrooms=${bedroomsFilter}&bathrooms=${bathroomsFilter}&toilets=${toiletsFilter}&furnished=${furnishedFilter}`);
      // if (!response.ok) {
      //   throw new Error('Failed to fetch properties');
      // }
      // const data = await response.json();
      // setProperties(data.properties);
      // setTotalProperties(data.totalProperties);
      // setTotalPages(data.totalPages);
      // Toast.show({ type: 'success', text1: data.message });
    } catch (err: any) {
      setError(err.message || "Failed to load properties.");
      // Toast.show({ type: 'error', text1: err.message || 'Failed to load properties.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProperties();
  }, [
    page,
    limit,
    isAvailableFilter,
    propertyTypeFilter,
    bedroomsFilter,
    bathroomsFilter,
    toiletsFilter,
    furnishedFilter,
  ]); // Re-fetch when filters or pagination change

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
    console.log("Navigating to property details for:", propertyId);
    // In a real app, you would use router.push(`/property/${propertyId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <ScrollView className="flex-1 p-5">
        {/* Header */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(500)}
          className="mb-4"
        >
          <Text className="text-center text-blue-800 text-3xl font-bold mb-2">
            Explore Properties
          </Text>
          <Text className="text-center text-gray-600 text-base">
            Find your next perfect home or office space.
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
            <Text className="text-red-500 text-lg text-center">{error}</Text>
            <TouchableOpacity
              onPress={fetchAllProperties}
              className="bg-blue-600 py-3 px-6 rounded-lg mt-4"
            >
              <Text className="text-white text-base">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : properties.length === 0 ? (
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-600 text-lg text-center">
              No properties found matching your criteria.
            </Text>
            <Text className="text-gray-500 text-base mt-2">
              Try adjusting your filters.
            </Text>
          </View>
        ) : (
          <>
            {/* Property List */}
            <Animated.View entering={FadeInUp.delay(300).duration(500)}>
              <Text className="text-blue-700 text-xl font-bold mb-4">
                Available Listings ({totalProperties})
              </Text>
            </Animated.View>
            {properties.map((property, index) => (
              <Animated.View
                key={property._id}
                entering={FadeInUp.delay(index * 50 + 400).duration(500)} // Staggered entrance animation
                exiting={FadeOutDown.duration(300)}
                layout={Layout.springify()} // Smooth layout changes
              >
                <PropertyCard
                  property={property}
                  onPress={handlePropertyPress}
                />
              </Animated.View>
            ))}

            {/* Pagination Controls */}
            <Animated.View
              entering={FadeInUp.delay(properties.length * 50 + 500).duration(
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
            </Animated.View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllPropertiesScreen;
