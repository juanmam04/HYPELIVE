import { Stack } from "expo-router";
import { colors } from "@hypelive/design-tokens";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.ink },
        headerTintColor: colors.textPrimary,
        contentStyle: { backgroundColor: colors.ink },
      }}
    >
      <Stack.Screen name="login" options={{ title: "Iniciar sesión" }} />
      <Stack.Screen name="register" options={{ title: "Crear cuenta" }} />
    </Stack>
  );
}
