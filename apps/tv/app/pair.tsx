import { useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import { BRAND_NAME } from "@hypelive/domain";
import { colors, spacing } from "@hypelive/design-tokens";
import type { DevicePairingStatus } from "@hypelive/types";
import { Button } from "../src/components/Button";
import { FakeQr } from "../src/components/FakeQr";
import { usePairing } from "../src/providers/PairingProvider";
import { OVERSCAN } from "../src/lib/theme";

function randomCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () =>
    alphabet[Math.floor(Math.random() * alphabet.length)],
  ).join("");
}

export default function PairScreen() {
  const { setPaired } = usePairing();
  const [code, setCode] = useState(randomCode);
  const [status, setStatus] = useState<DevicePairingStatus>("waiting");
  const [secondsLeft, setSecondsLeft] = useState(120);

  const pairUrl = useMemo(
    () => Linking.createURL(`pair/${code}`),
    [code],
  );

  const regenerate = useCallback(() => {
    setCode(randomCode());
    setStatus("waiting");
    setSecondsLeft(120);
  }, []);

  useEffect(() => {
    if (status !== "waiting") return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setStatus("expired");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [status, code]);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => sub.remove();
  }, []);

  async function simulatePair() {
    setStatus("paired");
    await setPaired(true);
    setTimeout(() => router.replace("/home"), 800);
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.brand}>{BRAND_NAME}</Text>
      <Text style={styles.title}>Emparejá tu televisor</Text>
      <Text style={styles.sub}>
        Abrí la app en el teléfono e ingresá el código, o escaneá el código
        simulado.
      </Text>

      <View style={styles.row}>
        <View style={styles.codeBlock}>
          <Text style={styles.code}>{code}</Text>
          <Text style={styles.status}>
            {status === "waiting" && `Esperando… ${secondsLeft}s`}
            {status === "paired" && "¡Emparejado!"}
            {status === "expired" && "Código expirado"}
            {status === "cancelled" && "Cancelado"}
          </Text>
        </View>
        <FakeQr value={pairUrl} />
      </View>

      <View style={styles.actions}>
        {status === "waiting" ? (
          <Button
            label="Simular emparejamiento"
            hasTVPreferredFocus
            onPress={() => void simulatePair()}
          />
        ) : null}
        <Button
          label="Regenerar código"
          variant="secondary"
          onPress={regenerate}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ink,
    padding: OVERSCAN,
    justifyContent: "center",
    gap: spacing[4],
  },
  brand: {
    color: colors.accentSoft,
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: 1,
  },
  title: { color: colors.textPrimary, fontSize: 42, fontWeight: "700" },
  sub: { color: colors.textSecondary, fontSize: 22, maxWidth: 720 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[8],
    flexWrap: "wrap",
    marginVertical: spacing[4],
  },
  codeBlock: { gap: spacing[3] },
  code: {
    color: colors.textPrimary,
    fontSize: 64,
    fontWeight: "700",
    letterSpacing: 12,
  },
  status: { color: colors.textMuted, fontSize: 20 },
  actions: { flexDirection: "row", gap: spacing[4], flexWrap: "wrap" },
});
