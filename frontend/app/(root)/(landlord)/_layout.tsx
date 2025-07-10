// app/(landlord)/_layout.tsx
import { TabIcon } from "@/components/TabIcon";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { Tabs } from "expo-router";
import React from "react";
import { Focused } from "../(tenants)/_layout";

export default function LandlordLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#fff",
          minHeight: 70,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="indexLandlord"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }: Focused) => (
            <TabIcon focused={focused} icon={icons.home} />
          ),
        }}
      />
      <Tabs.Screen
        name="MyProperties"
        options={{
          title: "My Properties",
          tabBarIcon: ({ focused }: Focused) => (
            <TabIcon focused={focused} icon={images.avatar} />
          ),
        }}
      />
      <Tabs.Screen
        name="AddProperty"
        options={{
          title: "Add",
          tabBarIcon: ({ focused }: Focused) => (
            <TabIcon focused={focused} icon={images.add} />
          ),
        }}
      />
      <Tabs.Screen
        name="LandlordBookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ focused }: Focused) => (
            <TabIcon focused={focused} icon={images.list} />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }: Focused) => (
            <TabIcon focused={focused} icon={images.settings} />
          ),
        }}
      />
    </Tabs>
  );
}
