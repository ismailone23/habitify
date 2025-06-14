import { API_URL } from "@/constants";
import { asyncStoragePersister, queryClient } from "@/lib/queryClient";
import { trpc } from "@/lib/trpc";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { httpBatchLink } from "@trpc/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import superjson from "superjson";

export let token: string | undefined = undefined;

export const setToken = (tk: string) => {
  token = tk;
};

export default function TRPcProvider({ children }: { children: ReactNode }) {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${API_URL}/api/trpc`,
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
      <PersistQueryClientProvider
        persistOptions={{ persister: asyncStoragePersister }}
        client={queryClient}
      >
        {children}
      </PersistQueryClientProvider>
    </trpc.Provider>
  );
}
