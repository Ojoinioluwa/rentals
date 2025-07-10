import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
// You might use an actual icon library like react-native-vector-icons
// For this example, we'll use a simple text emoji as a placeholder icon
const SearchIcon = () => (
  <Text className="text-gray-500 text-xl font-bold mr-2">🔍</Text>
);

// Define the props interface
interface LocationSearchBarProps {
  city: string;
  setCity: (city: string) => void;
  state: string;
  setState: (state: string) => void;
  country: string;
  setCountry: (country: string) => void;
  onSearch: () => void; // Function to be called when the search button is pressed
  placeholderCity?: string;
  placeholderState?: string;
  placeholderCountry?: string;
  searchButtonText?: string;
}

const LocationSearchBar: React.FC<LocationSearchBarProps> = ({
  city,
  setCity,
  state,
  setState,
  country,
  setCountry,
  onSearch,
  placeholderCity = "e.g., Ado Ekiti",
  placeholderState = "e.g., Ekiti",
  placeholderCountry = "e.g., Nigeria",
  searchButtonText = "Search Homes",
}) => {
  return (
    <View className="bg-white rounded-xl mx-4 mb-5 p-4 shadow-lg border border-gray-100">
      <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
        Find Your Perfect Location
      </Text>

      {/* City Input */}
      <View className="mb-3">
        <Text className="text-gray-700 text-sm font-semibold mb-2">City</Text>
        <View className="flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
          <SearchIcon />
          <TextInput
            className="flex-1 text-base text-gray-800"
            placeholder={placeholderCity}
            placeholderTextColor="#A0AEC0" // Tailwind gray-400
            value={city}
            onChangeText={setCity}
            autoCapitalize="words"
          />
        </View>
      </View>

      {/* State Input */}
      <View className="mb-3">
        <Text className="text-gray-700 text-sm font-semibold mb-2">State</Text>
        <View className="flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
          <SearchIcon />
          <TextInput
            className="flex-1 text-base text-gray-800"
            placeholder={placeholderState}
            placeholderTextColor="#A0AEC0"
            value={state}
            onChangeText={setState}
            autoCapitalize="words"
          />
        </View>
      </View>

      {/* Country Input */}
      <View className="mb-5">
        <Text className="text-gray-700 text-sm font-semibold mb-2">
          Country
        </Text>
        <View className="flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
          <SearchIcon />
          <TextInput
            className="flex-1 text-base text-gray-800"
            placeholder={placeholderCountry}
            placeholderTextColor="#A0AEC0"
            value={country}
            onChangeText={setCountry}
            autoCapitalize="words"
          />
        </View>
      </View>

      {/* Search Button */}
      <TouchableOpacity
        className="bg-blue-600 py-4 rounded-lg items-center shadow-md"
        onPress={onSearch}
      >
        <Text className="text-white text-lg font-bold">{searchButtonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LocationSearchBar;
