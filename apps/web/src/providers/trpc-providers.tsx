"use client";

import { trpc } from "@/utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import superjson from "superjson";

export let token: string | undefined = undefined;

export const setToken = (tk: string) => {
  token = tk;
};
export interface TRPCProviderProps {
  children: ReactNode;
}
export default function TRPCProvider({ children }: TRPCProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
          },
        },
      })
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `/api/trpc`,
          transformer: superjson,
          headers() {
            return {
              authorization: token ? `Bearer ${token}` : undefined,
            };
          },
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <>{children}</>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
