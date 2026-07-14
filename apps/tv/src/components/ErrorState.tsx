import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@hypelive/design-tokens";
import { Button } from "./Button";

export function ErrorState({
  title = "No se pudo cargar",
  message = "Revisá la conexión e intentá de nuevo.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{message}</Text>
      {onRetry ? <Button label="Reintentar" onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing[6], alignItems: "center", gap: spacing[3] },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: "600" },
  body: { color: colors.danger, fontSize: 18, textAlign: "center" },
});
