import { Image, View } from "react-native";

// TabIcon component for consistent tab bar icons
export const TabIcon = ({ focused, icon }: { focused: boolean; icon: any }) => {
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
