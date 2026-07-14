import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { colors } from "@hypelive/design-tokens";
import { usePairing } from "../src/providers/PairingProvider";

export default function Index() {
  const { paired, loading } = usePairing();

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
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return <Redirect href={paired ? "/home" : "/pair"} />;
}
