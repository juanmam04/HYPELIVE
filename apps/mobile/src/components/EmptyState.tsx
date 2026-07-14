import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@hypelive/design-tokens";
import { Button } from "./Button";

type Props = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.body}>{description}</Text> : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} style={styles.btn} />
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
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },
  btn: { marginTop: spacing[3], alignSelf: "stretch" },
});
