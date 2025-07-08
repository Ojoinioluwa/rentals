import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
  Alert, // Using Alert for user feedback in this simulation
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeInUp,
  FadeOutDown,
  Layout, // For smooth layout transitions on image add/remove
} from "react-native-reanimated";
// import { useMutation } from '@tanstack/react-query'; // Commented out as requested
// import Toast from 'react-native-toast-message'; // For displaying messages

const { width } = Dimensions.get("window");

interface UploadImagesScreenProps {
  propertyId: string; // The ID of the property to upload images for
  onUploadSuccess?: () => void; // Optional callback after successful upload
  onGoBack?: () => void; // Optional callback to navigate back
}

const UploadImagesScreen: React.FC<UploadImagesScreenProps> = ({
  propertyId,
  onUploadSuccess,
  onGoBack,
}) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // Placeholder for useMutation for uploading images
  // const { mutateAsync, isPending } = useMutation({
  //   mutationKey: ['uploadImages', propertyId],
  //   mutationFn: async (imagesToUpload: string[]) => {
  //     // Simulate your API call here
  //     console.log(`Uploading images for property ${propertyId}:`, imagesToUpload);
  //     return new Promise((resolve, reject) => {
  //       setTimeout(() => {
  //         if (imagesToUpload.length > 0 && Math.random() > 0.1) { // Simulate success 90% of the time
  //           resolve({ success: true, message: `${imagesToUpload.length} Images added` });
  //         } else if (imagesToUpload.length === 0) {
  //           reject(new Error("Images Not added, ensure to upload the images properly"));
  //         }
  //         else {
  //           reject(new Error("Failed to upload images. Please try again."));
  //         }
  //       }, 2000);
  //     });
  //   },
  // });

  const isPending = false; // Set to true when using actual useMutation

  const handleAddImage = () => {
    // In a real app, this would open an image picker (e.g., Expo ImagePicker)
    // and add the selected image URIs to the state.
    // For simulation, we'll add a dummy image URL.
    const newDummyImage = `https://placehold.co/200x200/ADD8E6/000000?text=Image%20${
      selectedImages.length + 1
    }`;
    setSelectedImages((prevImages) => [...prevImages, newDummyImage]);
    // Toast.show({ type: 'info', text1: 'Image added for preview.' });
    Alert.alert("Image Added", "A dummy image has been added for preview.");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
    // Toast.show({ type: 'info', text1: 'Image removed.' });
    Alert.alert(
      "Image Removed",
      "The image has been removed from the selection."
    );
  };

  const handleSubmitUpload = async () => {
    if (selectedImages.length === 0) {
      // Toast.show({ type: 'error', text1: 'Please select at least one image to upload.' });
      Alert.alert("No Images", "Please select at least one image to upload.");
      return;
    }

    console.log(
      "Initiating upload for property:",
      propertyId,
      "Images:",
      selectedImages
    );
    // try {
    //   const response = await mutateAsync(selectedImages);
    //   Toast.show({
    //     type: 'success',
    //     text1: response.message,
    //   });
    //   setSelectedImages([]); // Clear selected images after successful upload
    //   onUploadSuccess && onUploadSuccess(); // Call success callback
    // } catch (error: any) {
    //   Toast.show({
    //     type: 'error',
    //     text1: error.message || 'An error occurred during upload.',
    //   });
    // }
    // --- Simulation for demonstration ---
    Alert.alert("Upload Initiated", "Simulating image upload...");
    setTimeout(() => {
      if (Math.random() > 0.2) {
        // Simulate success 80% of the time
        Alert.alert(
          "Upload Successful",
          `${selectedImages.length} images uploaded for property ${propertyId}.`
        );
        setSelectedImages([]);
        onUploadSuccess && onUploadSuccess();
      } else {
        Alert.alert(
          "Upload Failed",
          "Simulated error: Could not upload images. Please try again."
        );
      }
    }, 2000);
    // --- End Simulation ---
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <ScrollView className="flex-1 p-5">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={onGoBack}
            className="bg-blue-600 p-3 rounded-full shadow-lg"
          >
            <Text className="text-white text-xl">⬅️</Text>
          </TouchableOpacity>
          <Text className="text-blue-800 text-2xl font-bold flex-1 text-center pr-10">
            Upload Property Images
          </Text>
        </View>
        <Text className="text-center text-gray-600 text-base mb-8">
          Add high-quality images to showcase your property.
        </Text>

        {/* Add Image Button */}
        <TouchableOpacity
          onPress={handleAddImage}
          className="bg-blue-500 py-4 rounded-xl flex-row items-center justify-center mb-6 shadow-md"
          disabled={isPending}
        >
          <Text className="text-white text-lg font-semibold mr-2">
            Select Images
          </Text>
          <Text className="text-white text-xl">📸</Text>
        </TouchableOpacity>

        {/* Image Preview Area */}
        <View className="bg-white p-5 rounded-xl shadow-md mb-6">
          <Text className="text-blue-700 text-xl font-bold mb-4">
            Selected Images ({selectedImages.length})
          </Text>
          {selectedImages.length === 0 ? (
            <View className="items-center py-10 border border-dashed border-gray-300 rounded-lg">
              <Text className="text-gray-500 text-base">
                No images selected yet.
              </Text>
              <Text className="text-gray-400 text-sm mt-1">
                Tap &apos; Select Images &apos; to add some!
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-center">
              {selectedImages.map((imageUri, index) => (
                <Animated.View
                  key={imageUri + index} // Use index as part of key if URIs can be duplicated
                  layout={Layout.springify()} // Smooth animation for add/remove
                  entering={FadeInUp.delay(index * 50).duration(400)}
                  exiting={FadeOutDown.duration(300)}
                  className="relative w-28 h-28 m-2 rounded-lg border border-blue-200 overflow-hidden shadow-sm"
                >
                  <Image
                    source={{ uri: imageUri }}
                    className="w-full h-full"
                    resizeMode="cover"
                    onError={(e) =>
                      console.log("Image loading error:", e.nativeEvent.error)
                    }
                  />
                  <TouchableOpacity
                    onPress={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 border-2 border-white"
                    disabled={isPending}
                  >
                    <Text className="text-white text-xs font-bold">✖️</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          )}
          {selectedImages.length > 0 && (
            <Text className="text-gray-500 text-sm text-center mt-4">
              You can add more images or remove existing ones.
            </Text>
          )}
        </View>

        {/* Upload Button */}
        <TouchableOpacity
          onPress={handleSubmitUpload}
          className="bg-blue-600 py-4 rounded-xl flex-row items-center justify-center shadow-md mb-10"
          disabled={isPending || selectedImages.length === 0}
        >
          {isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white text-lg font-bold">Upload Images</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UploadImagesScreen;
