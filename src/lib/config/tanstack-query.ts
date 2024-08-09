import { broadcastQueryClient } from "@tanstack/query-broadcast-client-experimental";
import { QueryClient } from "@tanstack/react-query";

import { APP_VERSION } from "@/lib/utils/constants";

// Create a client for react-query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

broadcastQueryClient({
  queryClient,
  broadcastChannel: APP_VERSION,
});
