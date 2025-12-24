"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { ToastProviderClient, useToast } from "@/components/ui/use-toast";

function ToastRenderer() {
  const { toasts } = useToast();

  return (
    <>
      {toasts.map((toast) => (
        <Toast key={toast.id}>
          <div>
            <ToastTitle>{toast.title}</ToastTitle>
            {toast.description ? <ToastDescription>{toast.description}</ToastDescription> : null}
          </div>
          <ToastClose />
        </Toast>
      ))}
    </>
  );
}

export function Toaster() {
  return (
    <ToastProvider swipeDirection="right">
      <ToastRenderer />
      <ToastViewport />
    </ToastProvider>
  );
}

export function ToastRootProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastProviderClient>
      {children}
      <Toaster />
    </ToastProviderClient>
  );
}
