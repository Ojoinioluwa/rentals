import { AnimatedView } from "@/app/(root)/LandlordComponents/UploadImages";
import {
  FormInputProps,
  FormPickerPropertyProps,
  FormPickerProps,
  FormSwitchProps,
  PropertyCardProps,
} from "@/types/property.types";
import React from "react";
import {
  Image,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Picker } from "@react-native-picker/picker";

export const propertyTypes = [
  "apartment",
  "self-contain",
  "duplex",
  "shop",
  "office",
  "room",
  "studio",
];

export const availableFeatures = [
  "Water Supply",
  "Electricity",
  "Parking",
  "Security",
  "Balcony",
  "Gym",
  "Swimming Pool",
];

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onPress,
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

  return (
    <AnimatedView style={animatedStyle} className="w-full mb-4">
      <TouchableOpacity
        onPress={() => onPress(property._id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100"
      >
        {property.images && property.images.length > 0 ? (
          <Image
            source={{ uri: property.images[0] }}
            className="w-full h-48"
            resizeMode="cover"
            onError={(e) =>
              console.log("Image loading error:", e.nativeEvent.error)
            }
          />
        ) : (
          <View className="w-full h-48 bg-gray-200 justify-center items-center">
            <Text className="text-gray-500">No Image Available</Text>
          </View>
        )}
        <View className="p-4">
          <Text className="text-xl font-bold text-blue-800 mb-2">
            {property.title}
          </Text>
          <Text className="text-gray-700 text-base mb-2" numberOfLines={2}>
            {property.description}
          </Text>
          <View className="flex-row items-center mb-1">
            <Text className="text-blue-600 font-semibold mr-2">Type:</Text>
            <Text className="text-gray-600 capitalize">
              {property.propertyType}
            </Text>
          </View>
          <View className="flex-row items-center mb-1">
            <Text className="text-blue-600 font-semibold mr-2">Price:</Text>
            <Text className="text-green-600 font-bold text-lg">
              ₦{property.price.toLocaleString()} / {property.billingCycle}
            </Text>
          </View>
          <View className="flex-row flex-wrap mt-2">
            {property.bedrooms > 0 && (
              <View className="flex-row items-center mr-4">
                <Text className="text-gray-500 text-sm">
                  🛏️ {property.bedrooms}
                </Text>
              </View>
            )}
            {property.bathrooms > 0 && (
              <View className="flex-row items-center mr-4">
                <Text className="text-gray-500 text-sm">
                  🚿 {property.bathrooms}
                </Text>
              </View>
            )}
            {property.toilets > 0 && (
              <View className="flex-row items-center">
                <Text className="text-gray-500 text-sm">
                  🚽 {property.toilets}
                </Text>
              </View>
            )}
          </View>
          <View className="flex-row items-center mt-2">
            <Text className="text-blue-600 font-semibold mr-2">Location:</Text>
            <Text className="text-gray-600">
              {property.location.city}, {property.location.state}
            </Text>
          </View>
          <View className="flex-row items-center mt-2">
            <Text className="text-blue-600 font-semibold mr-2">Status:</Text>
            <Text
              className={`font-semibold ${
                property.isAvailable ? "text-green-500" : "text-red-500"
              }`}
            >
              {property.isAvailable ? "Available" : "Not Available"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </AnimatedView>
  );
};

export const FormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  touched,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  icon,
  secureTextEntry = false,
  editable = true,
}) => (
  <View className="mb-4">
    <Text className="text-gray-700 text-base font-semibold mb-2">{label}</Text>
    <View className="bg-white py-3 px-4 rounded-xl flex-row items-center border border-blue-200">
      {icon && <View className="mr-3">{icon}</View>}
      <TextInput
        className="flex-1 text-gray-800 text-base"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF" // gray-400
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        secureTextEntry={secureTextEntry}
        editable={editable}
      />
    </View>
    {touched && error && (
      <Text className="text-red-500 text-sm mt-1 ml-2">{error}</Text>
    )}
  </View>
);

export const FormSwitch: React.FC<FormSwitchProps> = ({
  label,
  value,
  onValueChange,
}) => (
  <View className="flex-row items-center justify-between py-3 px-4 bg-white rounded-xl border border-blue-200 mb-4">
    <Text className="text-gray-700 text-base font-semibold">{label}</Text>
    <Switch
      trackColor={{ false: "#E0E0E0", true: "#60A5FA" }} // blue-300
      thumbColor={value ? "#2563EB" : "#F4F4F4"} // blue-600
      ios_backgroundColor="#E0E0E0"
      onValueChange={onValueChange}
      value={value}
    />
  </View>
);

export const FormPicker: React.FC<FormPickerProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  touched,
  options,
  icon,
  editable = true,
}) => (
  <View className="mb-4">
    <Text className="text-gray-700 text-base font-semibold mb-2">{label}</Text>
    <View className="bg-white py-3 px-4 rounded-xl flex-row items-center border border-blue-200">
      {icon && <View className="mr-3">{icon}</View>}
      <TextInput
        className="flex-1 text-gray-800 text-base"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        editable={editable}
      />
    </View>
    {touched && error && (
      <Text className="text-red-500 text-sm mt-1 ml-2">{error}</Text>
    )}
    <Text className="text-gray-500 text-xs mt-1 ml-2">
      Options: {options.join(", ")}
    </Text>
  </View>
);

export const FormPickerProperty: React.FC<FormPickerPropertyProps> = ({
  label,
  value,
  onValueChange,
  error,
  touched,
  options,
  icon,
  editable = true,
}) => (
  <View className="mb-4">
    <Text className="text-gray-700 text-base font-semibold mb-2">{label}</Text>
    <View className="bg-white py-1 px-2 rounded-xl border border-blue-200">
      {icon && <View className="mb-1">{icon}</View>}
      <Picker
        selectedValue={value}
        enabled={editable}
        onValueChange={onValueChange}
        style={{ color: "#111", fontSize: 16 }}
      >
        <Picker.Item label={label} value="" />
        {options.map((opt) => (
          <Picker.Item key={opt} label={opt} value={opt.toLowerCase()} />
        ))}
      </Picker>
    </View>
    {touched && error && (
      <Text className="text-red-500 text-sm mt-1 ml-2">{error}</Text>
    )}
  </View>
);
