import { QueryClient } from "@tanstack/react-query";

// Create a client for react-query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});
