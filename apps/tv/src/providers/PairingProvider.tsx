import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PAIR_KEY = "hypelive.tv.paired";

type PairingContextValue = {
  paired: boolean;
  loading: boolean;
  setPaired: (value: boolean) => Promise<void>;
};

const PairingContext = createContext<PairingContextValue | null>(null);

export function PairingProvider({ children }: { children: ReactNode }) {
  const [paired, setPairedState] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const value = await AsyncStorage.getItem(PAIR_KEY);
        if (!cancelled) setPairedState(value === "1");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setPaired = useCallback(async (value: boolean) => {
    setPairedState(value);
    if (value) await AsyncStorage.setItem(PAIR_KEY, "1");
    else await AsyncStorage.removeItem(PAIR_KEY);
  }, []);

  const value = useMemo(
    () => ({ paired, loading, setPaired }),
    [paired, loading, setPaired],
  );

  return (
    <PairingContext.Provider value={value}>{children}</PairingContext.Provider>
  );
}

export function usePairing(): PairingContextValue {
  const ctx = useContext(PairingContext);
  if (!ctx) throw new Error("usePairing dentro de PairingProvider");
  return ctx;
}
