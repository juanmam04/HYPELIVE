import { Component, type ErrorInfo, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { captureException } from "@hypelive/analytics";
import { colors, radii, spacing, touchTargets } from "@hypelive/design-tokens";

type Props = { children: ReactNode; fallbackTitle?: string };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    captureException(error, { componentStack: info.componentStack });
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.wrap}>
          <Text style={styles.title}>
            {this.props.fallbackTitle ?? "Algo salió mal"}
          </Text>
          <Text style={styles.body}>
            Ocurrió un error inesperado. Podés reintentar.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => this.setState({ error: null })}
            style={styles.btn}
          >
            <Text style={styles.btnText}>Reintentar</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing[6],
    gap: spacing[3],
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  body: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
  },
  btn: {
    marginTop: spacing[3],
    minHeight: touchTargets.min,
    paddingHorizontal: spacing[5],
    borderRadius: radii.md,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: colors.textOnAccent,
    fontWeight: "600",
    fontSize: 16,
  },
});
