import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "../contexts/ThemeProvider";

const queryClient = new QueryClient();

type Props = {
  children: ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            /* Rồi theo theme (CSS vars của ThemeProvider) thay vì mặc định
               nền đen chữ trắng — tránh nổi gai trên light theme */
            style: {
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            },
          }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}