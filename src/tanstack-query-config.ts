import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

import { APP_VERSION } from "@/utils/constants";

// Create a client for react-query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
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
});
