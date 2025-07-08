import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to LandingPage as soon as the index loads
    router.replace("/LandingPage");
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* to indicate loading when assests aren't ready */}
      <ActivityIndicator size="large" color="#0061FF" />
    </View>
  );
}
