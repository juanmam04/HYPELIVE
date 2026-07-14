import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { BRAND_NAME } from "@hypelive/domain";
import { registerSchema } from "@hypelive/validation";
import { colors, radii, spacing, touchTargets } from "@hypelive/design-tokens";
import { Button } from "../../src/components/Button";
import { useAuth } from "../../src/providers/AuthProvider";

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    const parsed = registerSchema.safeParse({
      email,
      password,
      displayName,
      username,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Datos inválidos");
      return;
    }
    setLoading(true);
    try {
      await signUp(parsed.data);
      router.replace("/(tabs)/home");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo registrar");
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
          <Text style={styles.sub}>Creá tu cuenta de creador o espectador.</Text>

          <Text style={styles.label}>Nombre</Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Tu nombre"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />

          <Text style={styles.label}>Usuario</Text>
          <TextInput
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
            placeholder="usuario_ejemplo"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />

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
            placeholder="Mínimo 8 caracteres"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            label="Crear cuenta"
            loading={loading}
            onPress={() => void onSubmit()}
          />

          <Link href="/(auth)/login" style={styles.link}>
            ¿Ya tenés cuenta? Iniciá sesión
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  flex: { flex: 1 },
  content: { padding: spacing[5], gap: spacing[2] },
  brand: {
    color: colors.textPrimary,
    fontSize: 34,
    fontWeight: "700",
  },
  sub: {
    color: colors.textSecondary,
    marginBottom: spacing[4],
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
  },
});
