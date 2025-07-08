import React from "react";
import { Text, View } from "react-native";

type Props = { children: React.ReactNode };

type State = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error("ErrorBoundary caught an error", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500 font-semibold">
            Something went wrong.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
