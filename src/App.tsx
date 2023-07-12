import { Suspense } from "react";
import { RouterProvider } from "@tanstack/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { OidcAuthProvider } from "./components/OidcAuthProvider";
import { router } from "./router.config";
import "./i18n.config";

// Create a client for react-query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  },
});

const App = () => {
  return (
    <OidcAuthProvider>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<p>root suspense loading...</p>}>
          <RouterProvider router={router} defaultPreload="intent" />
        </Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </OidcAuthProvider>
  );
};

export default App;
