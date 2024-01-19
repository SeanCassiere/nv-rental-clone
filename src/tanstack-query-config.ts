import { broadcastQueryClient } from "@tanstack/query-broadcast-client-experimental";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

import { APP_VERSION } from "@/utils/constants";

// Create a client for react-query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      gcTime: 1000 * 60 * 45, // 45 minutes or higher than the persister's maxAge
    },
  },
});

export const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  buster: APP_VERSION,
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 45, // 1 hour
});

broadcastQueryClient({
  queryClient,
  broadcastChannel: APP_VERSION,
});
