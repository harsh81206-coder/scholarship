"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  const lang = useAppStore((state) => state.lang);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000, retry: 1 },
        },
      })
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.locale = lang;
  }, [lang]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
