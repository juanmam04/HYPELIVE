import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "@hypelive/design-tokens";
import { AppProviders } from "../src/providers/AppProviders";

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar hidden />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.ink },
          animation: "fade",
        }}
      />
    </AppProviders>
  );
}
