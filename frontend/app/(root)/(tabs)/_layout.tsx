import icons from "@/constants/icons";
import images from "@/constants/images";
import { Tabs } from "expo-router";
import React from "react";
import { Image, View } from "react-native";

// Tab Icon Component
const TabIcon = ({ focused, icon }: { focused: boolean; icon: any }) => {
  return (
    <View className="flex-1 mt-3 flex flex-col items-center">
      <Image
        source={icon}
        style={{ width: 24, height: 24 }}
        resizeMode="contain"
        tintColor={focused ? "#0061FF" : "#666876"}
      />
    </View>
  );
};

const TabsLayout = () => {
  const role = false;

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#fff",
          minHeight: 70,
        },
      }}
    >
      {/* Shared Home screen */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} />
          ),
        }}
      />

      {/* ============ Renter Tabs ============ */}
      {role && [
        <Tabs.Screen
          key="TenantBookings"
          name="TenantBookings"
          options={{
            title: "Tenant Bookings",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={images.list} />
            ),
          }}
        />,
        <Tabs.Screen
          key="Explore"
          name="ListProperties"
          options={{
            title: "Explore",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={icons.search} />
            ),
          }}
        />,
      ]}

      {/* ============ Landlord Tabs ============ */}
      {!role && [
        <Tabs.Screen
          key="MyProperties"
          name="MyProperties"
          options={{
            title: "My Properties",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={images.list} />
            ),
          }}
        />,
        <Tabs.Screen
          key="AddProperty"
          name="AddProperty"
          options={{
            title: "Add Properties",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={images.add} />
            ),
          }}
        />,
        <Tabs.Screen
          key="LandlordBookings"
          name="LandlordBookings"
          options={{
            title: "Bookings",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={images.list} />
            ),
          }}
        />,
      ]}

      {/* Shared Settings */}
      <Tabs.Screen
        name="Settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={images.settings} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
