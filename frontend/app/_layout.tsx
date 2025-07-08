// RootLayout.js or RootLayout.tsx
import { AppWithStore } from "@/components/AppWithStore";
import store from "@/redux/store/store";
import { Provider } from "react-redux";

export default function RootLayout() {

  return (
    // redux store
    <Provider store={store}>
      <AppWithStore />
    </Provider>
  );
}
