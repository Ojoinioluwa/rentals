import { uploadPropertyImages } from "@/services/landlord/landlordServices";
import { QueryClient, useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInUp,
  FadeOutDown,
  Layout,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const UploadImagesScreen = () => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const queryClient = new QueryClient();

  const { id } = useLocalSearchParams() as { id: string };
  const router = useRouter();
  const propertyId = id;

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["uploadImages"],
    mutationFn: ({ id, images }: { id: string; images: FormData }) =>
      uploadPropertyImages({ id, images }),
  });

  const handleAddImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission denied",
        text2: "Allow media access to select images.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setSelectedImages((prev) => [...prev, selectedUri]);
      Toast.show({ type: "info", text1: "Image added." });
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
    Toast.show({ type: "info", text1: "Image removed." });
  };

  const handleSubmitUpload = async () => {
    if (selectedImages.length === 0) {
      Toast.show({
        type: "error",
        text1: "Please select at least one image.",
      });
      return;
    }

    try {
      const formData = new FormData();

      selectedImages.forEach((uri, index) => {
        const filename = uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename ?? "");
        const type = match ? `image/${match[1]}` : `image`;

        formData.append("images", {
          uri,
          name: filename,
          type,
        } as any);
      });

      const response = await mutateAsync({ id: propertyId, images: formData });
      queryClient.invalidateQueries({ queryKey: ["property", id] });
      router.back();
      Toast.show({ type: "success", text1: response.message });
      setSelectedImages([]);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message || "Upload failed.",
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <ScrollView className="flex-1 p-5">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
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
                Tap &apos;Select Images&apos; to add some!
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-center">
              {selectedImages.map((imageUri, index) => (
                <Animated.View
                  key={imageUri + index}
                  layout={Layout.springify()}
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
