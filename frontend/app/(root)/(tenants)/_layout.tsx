// app/(tenant)/_layout.tsx
import { TabIcon } from "@/components/TabIcon";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { Tabs } from "expo-router";
import React from "react";

export type Focused = { focused: boolean };

export default function TenantLayout() {
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
        name="indexTenant"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }: Focused) => (
            <TabIcon focused={focused} icon={icons.home} />
          ),
        }}
      />
      <Tabs.Screen
        name="TenantBookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ focused }: Focused) => (
            <TabIcon focused={focused} icon={images.list} />
          ),
        }}
      />
      <Tabs.Screen
        name="ListProperties"
        options={{
          title: "Explore",
          tabBarIcon: ({ focused }: Focused) => (
            <TabIcon focused={focused} icon={icons.search} />
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
