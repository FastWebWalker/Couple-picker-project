"use client";

import * as React from "react";

type ToastMessage = {
  id: string;
  title: string;
  description?: string;
  duration?: number;
};

type ToastContextValue = {
  toasts: ToastMessage[];
  toast: (data: Omit<ToastMessage, "id">) => void;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProviderClient({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = React.useCallback(
    (data: Omit<ToastMessage, "id">) => {
      const id = crypto.randomUUID();
      const message = { id, ...data };
      setToasts((prev) => [...prev, message]);
      if (data.duration !== 0) {
        window.setTimeout(() => dismiss(id), data.duration ?? 4000);
      }
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProviderClient");
  }
  return ctx;
}
