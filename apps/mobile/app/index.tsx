import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { colors } from "@hypelive/design-tokens";
import { useAuth } from "../src/providers/AuthProvider";

export default function Index() {
  const { loading, session, isDemo, profile } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.ink,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (session || isDemo || profile) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}
