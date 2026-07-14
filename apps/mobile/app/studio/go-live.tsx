import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatDuration, formatViewerCount } from "@hypelive/domain";
import { colors, radii, spacing, touchTargets } from "@hypelive/design-tokens";
import { Button } from "../../src/components/Button";
import {
  MockBroadcaster,
  type BroadcastQuality,
  type BroadcasterPreviewState,
} from "../../src/broadcasting/MockBroadcaster";

const QUALITIES: BroadcastQuality[] = ["480p", "720p", "1080p"];
const PROGRAMS = [
  { id: "prog-1", title: "Late Set" },
  { id: "prog-2", title: "Arena Highlights" },
];

/**
 * Go Live — simulated camera preview.
 * No camera / mic permissions are requested in Phase 0.
 * Swap MockBroadcaster for a real SDK behind the Broadcaster interface.
 */
export default function GoLiveScreen() {
  const broadcaster = useMemo(() => new MockBroadcaster(), []);
  const [state, setState] = useState<BroadcasterPreviewState>(
    broadcaster.getPreviewState(),
  );
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setState(broadcaster.getPreviewState());
      setTick((t) => t + 1);
    }, 1000);
    return () => {
      clearInterval(id);
      broadcaster.destroy();
    };
  }, [broadcaster]);

  const durationSec =
    state.isLive && state.startedAt
      ? Math.floor((Date.now() - state.startedAt) / 1000)
      : 0;

  function sync(fn: () => void) {
    fn();
    setState(broadcaster.getPreviewState());
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View
            style={[
              styles.preview,
              state.facing === "environment" && styles.previewBack,
            ]}
          >
            <Text style={styles.previewLabel}>
              Vista previa simulada ·{" "}
              {state.facing === "user" ? "frontal" : "trasera"}
            </Text>
            <Text style={styles.previewHint}>
              Sin permisos de cámara (Phase 0)
            </Text>
            {state.isLive ? (
              <View style={styles.liveRow}>
                <Text style={styles.livePill}>EN VIVO</Text>
                <Text style={styles.liveMeta}>
                  {formatDuration(durationSec)} ·{" "}
                  {formatViewerCount(state.viewerCount)} espectadores
                </Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.label}>Título</Text>
          <TextInput
            value={state.title}
            onChangeText={(t) => sync(() => broadcaster.setTitle(t))}
            placeholder="Título del stream"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />

          <Text style={styles.label}>Programa</Text>
          <View style={styles.row}>
            {PROGRAMS.map((p) => (
              <Button
                key={p.id}
                label={p.title}
                variant={state.programId === p.id ? "primary" : "secondary"}
                onPress={() => sync(() => broadcaster.setProgramId(p.id))}
                style={styles.chip}
              />
            ))}
          </View>

          <Text style={styles.label}>Controles</Text>
          <View style={styles.row}>
            <Button
              label="Voltear"
              variant="secondary"
              onPress={() => sync(() => broadcaster.flipCamera())}
              style={styles.chip}
            />
            <Button
              label={state.micEnabled ? "Mic ON" : "Mic OFF"}
              variant="secondary"
              onPress={() => sync(() => broadcaster.toggleMic())}
              style={styles.chip}
            />
            <Button
              label={state.flashEnabled ? "Flash ON" : "Flash OFF"}
              variant="secondary"
              onPress={() => sync(() => broadcaster.toggleFlash())}
              style={styles.chip}
            />
          </View>

          <Text style={styles.label}>Calidad</Text>
          <View style={styles.row}>
            {QUALITIES.map((q) => (
              <Button
                key={q}
                label={q}
                variant={state.quality === q ? "primary" : "secondary"}
                onPress={() => sync(() => broadcaster.setQuality(q))}
                style={styles.chip}
              />
            ))}
          </View>

          <Text style={styles.meta}>
            Conexión: {state.connection}
            {tick >= 0 ? "" : ""}
          </Text>

          {state.isLive ? (
            <Button
              label="Finalizar"
              variant="danger"
              onPress={() =>
                void sync(() => {
                  void broadcaster.stopBroadcast("mock-stream");
                })
              }
            />
          ) : (
            <Button
              label="Iniciar transmisión"
              disabled={!state.title.trim()}
              onPress={() =>
                void sync(() => {
                  void broadcaster.startBroadcast("mock-stream");
                })
              }
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  flex: { flex: 1 },
  content: { padding: spacing[4], gap: spacing[2] },
  preview: {
    aspectRatio: 9 / 16,
    maxHeight: 360,
    width: "100%",
    alignSelf: "center",
    borderRadius: radii.xl,
    backgroundColor: colors.slate,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing[4],
    overflow: "hidden",
  },
  previewBack: {
    backgroundColor: colors.elevated,
  },
  previewLabel: {
    color: colors.textPrimary,
    fontWeight: "600",
    textAlign: "center",
  },
  previewHint: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing[1],
    textAlign: "center",
  },
  liveRow: {
    position: "absolute",
    top: spacing[3],
    left: spacing[3],
    right: spacing[3],
    gap: spacing[1],
  },
  livePill: {
    alignSelf: "flex-start",
    backgroundColor: colors.live,
    color: colors.white,
    fontWeight: "700",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.sm,
    overflow: "hidden",
  },
  liveMeta: { color: colors.textPrimary, fontSize: 13 },
  label: {
    color: colors.textPrimary,
    fontWeight: "600",
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
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: spacing[2] },
  chip: { flexGrow: 0 },
  meta: { color: colors.textMuted, marginVertical: spacing[2] },
});
