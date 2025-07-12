import * as ImageManipulator from "expo-image-manipulator";

export async function optimizeImage(uri: string) {
  const manipResult = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 800 } }], // Resize to width of 800px
    {
      compress: 0.7, // quality
      format: ImageManipulator.SaveFormat.JPEG, // Can be PNG, JPEG
      base64: false,
    }
  );

  return manipResult.uri; // Use this new URI for upload
}
