import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@hypelive/design-tokens";
import { Button } from "./Button";

type Props = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "No se pudo cargar",
  message = "Revisá tu conexión e intentá de nuevo.",
  onRetry,
}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{message}</Text>
      {onRetry ? (
        <Button label="Reintentar" onPress={onRetry} style={styles.btn} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: spacing[6],
    alignItems: "center",
    gap: spacing[2],
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  body: {
    color: colors.danger,
    fontSize: 14,
    textAlign: "center",
  },
  btn: { marginTop: spacing[3], alignSelf: "stretch" },
});
