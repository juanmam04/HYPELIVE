import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@hypelive/design-tokens";
import { Button } from "./Button";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.body}>{description}</Text> : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing[6], alignItems: "center", gap: spacing[3] },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: "600" },
  body: { color: colors.textSecondary, fontSize: 18, textAlign: "center" },
});
