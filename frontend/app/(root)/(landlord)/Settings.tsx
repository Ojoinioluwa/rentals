import {
  SettingItem,
  SettingsHeader,
  SettingsProfile,
} from "@/components/SettingsItem";
import { logOutAction } from "@/redux/slice/authSlice";
import getUserFromStorage from "@/utils/getUserFromStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  LayoutChangeEvent,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

// Main Settings Screen Component
const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState();
  const [name, setName] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserFromStorage();
      setEmail(userData?.user.email);
      setName(userData?.user.name);
    };
    fetchUser();
  }, []);

  // State for collapsible sections
  const [accountExpanded, setAccountExpanded] = useState<boolean>(true);
  const [appExpanded, setAppExpanded] = useState<boolean>(true);

  const accountHeight = useSharedValue<number>(0);
  const appHeight = useSharedValue<number>(0);

  const accountAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: accountHeight.value,
      opacity: withTiming(accountExpanded ? 1 : 0, { duration: 200 }),
    };
  });

  const appAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: appHeight.value,
      opacity: withTiming(appExpanded ? 1 : 0, { duration: 200 }),
    };
  });

  // Function to toggle section expansion
  const toggleSection = (section: "account" | "app") => {
    if (section === "account") {
      setAccountExpanded(!accountExpanded);
      accountHeight.value = withTiming(accountExpanded ? 0 : 200, {
        // Adjust 200 based on content height
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
    } else if (section === "app") {
      setAppExpanded(!appExpanded);
      appHeight.value = withTiming(appExpanded ? 0 : 200, {
        // Adjust 200 based on content height
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
    }
  };

  const logoutOutHandler = async () => {
    dispatch(logOutAction());
    await AsyncStorage.removeItem("user");
    router.replace("/LandingPage");
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <SettingsHeader />
        {/* Profile Section */}
        <SettingsProfile name={name!} email={email!} />
        {/* Account Settings Section */}
        <View className="mt-6 mx-4 rounded-xl overflow-hidden shadow-md">
          <TouchableOpacity
            onPress={() => toggleSection("account")}
            className="flex-row items-center justify-between py-4 px-5 bg-blue-500 rounded-t-xl"
          >
            <Text className="text-white text-xl font-bold">
              Account Settings
            </Text>
            <Text className="text-white text-xl">
              {accountExpanded ? "▼" : "▲"}
            </Text>
          </TouchableOpacity>
          <Animated.View
            style={accountAnimatedStyle}
            className="overflow-hidden"
          >
            <View
              onLayout={(event: LayoutChangeEvent) => {
                // Set initial height for animation if needed, or calculate dynamically
                if (accountExpanded && accountHeight.value === 0) {
                  accountHeight.value = event.nativeEvent.layout.height;
                }
              }}
            >
              <SettingItem
                icon={<Text className="text-blue-600 text-lg">📝</Text>}
                title="Edit Profile"
                onPress={() => router.push("/EditProfile")}
              />
              <SettingItem
                icon={<Text className="text-blue-600 text-lg">🔑</Text>}
                title="Change Password"
                onPress={() => router.push("/ChangePassword")}
              />
              <SettingItem
                icon={<Text className="text-blue-600 text-lg">🔔</Text>}
                title="Notifications"
                onPress={() => setNotificationsEnabled(!notificationsEnabled)}
              >
                <Switch
                  trackColor={{ false: "#E0E0E0", true: "#60A5FA" }}
                  thumbColor={notificationsEnabled ? "#2563EB" : "#F4F4F4"}
                  ios_backgroundColor="#E0E0E0"
                  onValueChange={() =>
                    setNotificationsEnabled(!notificationsEnabled)
                  }
                  value={notificationsEnabled}
                />
              </SettingItem>
            </View>
          </Animated.View>
        </View>
        {/* App Preferences Section */}
        <View className="mt-4 mx-4 rounded-xl overflow-hidden shadow-md">
          <TouchableOpacity
            onPress={() => toggleSection("app")}
            className="flex-row items-center justify-between py-4 px-5 bg-blue-500 rounded-t-xl"
          >
            <Text className="text-white text-xl font-bold">
              App Preferences
            </Text>
            <Text className="text-white text-xl">
              {appExpanded ? "▼" : "▲"}
            </Text>
          </TouchableOpacity>
          <Animated.View style={appAnimatedStyle} className="overflow-hidden">
            <View
              onLayout={(event: LayoutChangeEvent) => {
                // Set initial height for animation if needed, or calculate dynamically
                if (appExpanded && appHeight.value === 0) {
                  appHeight.value = event.nativeEvent.layout.height;
                }
              }}
            >
              <SettingItem
                icon={<Text className="text-blue-600 text-lg">🎨</Text>}
                title="Dark Mode"
                onPress={() => setDarkModeEnabled(!darkModeEnabled)}
              >
                <Switch
                  trackColor={{ false: "#E0E0E0", true: "#60A5FA" }}
                  thumbColor={darkModeEnabled ? "#2563EB" : "#F4F4F4"}
                  ios_backgroundColor="#E0E0E0"
                  onValueChange={() => setDarkModeEnabled(!darkModeEnabled)}
                  value={darkModeEnabled}
                />
              </SettingItem>
              <SettingItem
                icon={<Text className="text-blue-600 text-lg">🌐</Text>}
                title="Language"
                onPress={() => console.log("Change Language")}
              />
              <SettingItem
                icon={<Text className="text-blue-600 text-lg">📄</Text>}
                title="Privacy Policy"
                onPress={() => console.log("View Privacy Policy")}
              />
              <SettingItem
                icon={<Text className="text-blue-600 text-lg">📜</Text>}
                title="Terms of Service"
                onPress={() => console.log("View Terms of Service")}
                isLast={true}
              />
            </View>
          </Animated.View>
        </View>
        {/* Help & Support */}
        <View className="mt-4 mx-4 rounded-xl overflow-hidden shadow-md">
          <SettingItem
            icon={<Text className="text-blue-600 text-lg">❓</Text>}
            title="Help & Support"
            onPress={() => router.push("/HelpSupport")}
          />
          <SettingItem
            icon={<Text className="text-blue-600 text-lg">⭐</Text>}
            title="Rate Us"
            onPress={() => console.log("Rate Us")}
            isLast={true}
          />
        </View>
        {/* Logout Button */}
        <TouchableOpacity
          onPress={logoutOutHandler}
          className="bg-red-500 mx-4 my-6 p-4 rounded-xl shadow-md flex-row items-center justify-center"
        >
          <Text className="text-white text-lg font-bold mr-2">Logout</Text>
          <Text className="text-white text-xl">➡️</Text>
        </TouchableOpacity>
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
