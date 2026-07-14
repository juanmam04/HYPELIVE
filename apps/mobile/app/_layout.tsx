import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "@hypelive/design-tokens";
import { AppProviders } from "../src/providers/AppProviders";

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.ink },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: "600" },
          contentStyle: { backgroundColor: colors.ink },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="live/[streamId]" options={{ title: "En vivo" }} />
        <Stack.Screen
          name="channel/[channelSlug]/index"
          options={{ title: "Canal" }}
        />
        <Stack.Screen
          name="channel/[channelSlug]/program/[programSlug]"
          options={{ title: "Programa" }}
        />
        <Stack.Screen name="watch/[videoId]" options={{ title: "Episodio" }} />
        <Stack.Screen name="studio/go-live" options={{ title: "Salir al aire" }} />

      </Stack>
    </AppProviders>
  );
}
