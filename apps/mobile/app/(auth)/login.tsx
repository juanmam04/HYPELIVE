import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { BRAND_NAME } from "@hypelive/domain";
import { loginSchema } from "@hypelive/validation";
import { colors, radii, spacing, touchTargets } from "@hypelive/design-tokens";
import { Button } from "../../src/components/Button";
import { useAuth } from "../../src/providers/AuthProvider";
import { hasSupabase } from "../../src/lib/supabase";

export default function LoginScreen() {
  const { signIn, enterDemo } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Datos inválidos");
      return;
    }
    setLoading(true);
    try {
      await signIn(parsed.data.email, parsed.data.password);
      router.replace("/(tabs)/home");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.brand}>{BRAND_NAME}</Text>
          <Text style={styles.sub}>Entrá para ver y transmitir.</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="vos@email.com"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button label="Entrar" loading={loading} onPress={() => void onSubmit()} />

          <Link href="/(auth)/register" style={styles.link}>
            ¿No tenés cuenta? Registrate
          </Link>

          {!hasSupabase() ? (
            <View style={styles.demo}>
              <Text style={styles.demoText}>
                Sin Supabase configurado — podés explorar con datos de ejemplo.
              </Text>
              <Button
                label="Continuar sin cuenta"
                variant="secondary"
                onPress={() => {
                  enterDemo();
                  router.replace("/(tabs)/home");
                }}
              />
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  flex: { flex: 1 },
  content: {
    padding: spacing[5],
    gap: spacing[2],
  },
  brand: {
    color: colors.textPrimary,
    fontSize: 34,
    fontWeight: "700",
    marginBottom: spacing[1],
  },
  sub: {
    color: colors.textSecondary,
    marginBottom: spacing[5],
    fontSize: 16,
  },
  label: {
    color: colors.textPrimary,
    fontWeight: "500",
    marginTop: spacing[2],
  },
  input: {
    minHeight: touchTargets.min,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.slate,
    color: colors.textPrimary,
    paddingHorizontal: spacing[3],
    fontSize: 16,
  },
  error: { color: colors.danger, marginVertical: spacing[2] },
  link: {
    color: colors.accentSoft,
    textAlign: "center",
    marginTop: spacing[4],
    fontSize: 15,
    minHeight: touchTargets.min,
    textAlignVertical: "center",
  },
  demo: { marginTop: spacing[6], gap: spacing[2] },
  demoText: { color: colors.textMuted, textAlign: "center", fontSize: 13 },
});
