import "@/app/global.css";
import { loadUserFromStorage, loginAction } from "@/redux/slice/authSlice";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import ErrorBoundary from "./ErrorBoundary";
import { queryClient } from "@/utils/queryClient";

export function AppWithStore() {
  const [fontLoaded] = useFonts({
    "Rubik-bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "Rubik-Extrabold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
    "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await loadUserFromStorage();
        if (userData) {
          dispatch(loginAction(userData));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    if (fontLoaded) {
      fetchUserData();
      SplashScreen.hideAsync();
    }
  }, [fontLoaded, dispatch]);

  if (!fontLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
