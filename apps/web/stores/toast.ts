import { create } from "zustand";

export type ToastTone = "default" | "success" | "error" | "info" | "warning";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
};

type ToastState = {
  toasts: ToastItem[];
  push: (toast: Omit<ToastItem, "id"> & { id?: string }) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

const MAX_VISIBLE = 3;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) => {
    const id = toast.id ?? crypto.randomUUID();
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id, tone: toast.tone ?? "default" },
      ].slice(-MAX_VISIBLE),
    }));
    return id;
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));
