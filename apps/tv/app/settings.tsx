import { useEffect } from "react";
import { BackHandler, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { BRAND_NAME } from "@hypelive/domain";
import { colors, spacing } from "@hypelive/design-tokens";
import { Button } from "../src/components/Button";
import { usePairing } from "../src/providers/PairingProvider";
import { OVERSCAN } from "../src/lib/theme";

export default function SettingsScreen() {
  const { setPaired } = usePairing();

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      router.back();
      return true;
    });
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Ajustes</Text>
      <Text style={styles.meta}>{BRAND_NAME} TV · Phase 0</Text>
      <Text style={styles.body}>
        Sin login email/password. La cuenta se vincula solo por emparejamiento
        de dispositivo.
      </Text>

      <View style={styles.actions}>
        <Button
          label="Desvincular dispositivo"
          variant="secondary"
          hasTVPreferredFocus
          onPress={async () => {
            await setPaired(false);
            router.replace("/pair");
          }}
        />
        <Button label="Atrás" variant="ghost" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ink,
    padding: OVERSCAN,
    gap: spacing[4],
    justifyContent: "center",
  },
  title: { color: colors.textPrimary, fontSize: 40, fontWeight: "700" },
  meta: { color: colors.textMuted, fontSize: 20 },
  body: { color: colors.textSecondary, fontSize: 22, maxWidth: 720 },
  actions: { gap: spacing[3], marginTop: spacing[4], maxWidth: 420 },
});
