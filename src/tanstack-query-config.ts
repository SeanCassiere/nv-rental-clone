import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";

// Create a client for react-query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      gcTime: 1000 * 60 * 45, // 45 minutes or higher than the persister's maxAge
    },
  },
});

export const persisterMaxAge = 1000 * 60 * 45; // 45 minutes

export const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});
