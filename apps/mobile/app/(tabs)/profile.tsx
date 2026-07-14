import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { BRAND_NAME } from "@hypelive/domain";
import { colors, spacing } from "@hypelive/design-tokens";
import { Button } from "../../src/components/Button";
import { useAuth } from "../../src/providers/AuthProvider";
import { hasSupabase } from "../../src/lib/supabase";

export default function ProfileScreen() {
  const { profile, signOut, session } = useAuth();

  const sessionLabel = session
    ? "Sesión activa"
    : profile
      ? "Cuenta local"
      : "Sin sesión";

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <View style={styles.content}>
        <Text style={styles.title}>Perfil</Text>
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.initial}>
              {(profile?.displayName ?? profile?.username ?? "P")
                .slice(0, 1)
                .toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>
            {profile?.displayName ?? profile?.username ?? "Invitado"}
          </Text>
          {profile?.username ? (
            <Text style={styles.meta}>@{profile.username}</Text>
          ) : null}
          <Text style={styles.meta}>{sessionLabel}</Text>
          <Text style={styles.brand}>{BRAND_NAME}</Text>
        </View>

        {!hasSupabase() ? (
          <Text style={styles.hint}>
            Configurá EXPO_PUBLIC_SUPABASE_* para auth real.
          </Text>
        ) : null}

        <Button
          label="Cerrar sesión"
          variant="secondary"
          onPress={async () => {
            await signOut();
            router.replace("/(auth)/login");
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  content: { flex: 1, padding: spacing[4], gap: spacing[4] },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: "700" },
  card: {
    alignItems: "center",
    backgroundColor: colors.slate,
    borderRadius: 16,
    padding: spacing[6],
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing[1],
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.elevated,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing[2],
  },
  initial: { color: colors.accentSoft, fontSize: 28, fontWeight: "700" },
  name: { color: colors.textPrimary, fontSize: 20, fontWeight: "600" },
  meta: { color: colors.textMuted, fontSize: 14 },
  brand: { color: colors.textSecondary, marginTop: spacing[3], fontSize: 13 },
  hint: { color: colors.textMuted, fontSize: 13, textAlign: "center" },
});
