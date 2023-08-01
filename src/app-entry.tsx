import { Suspense } from "react";
import { AuthProvider } from "react-oidc-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Router, RouterProvider } from "@tanstack/router";

import LoadingPlaceholder from "@/components/loading-placeholder";

import { reactOidcContextConfig } from "@/react-oidc-context-config";
import { queryClient } from "@/tanstack-query-config";
import {
  routeTree,
  stringifySearchFn,
  parseSearchFn,
} from "@/tanstack-router-config";
import "./i18next-config";

export const router = new Router({
  routeTree,
  defaultPreload: "intent",
  parseSearch: parseSearchFn,
  stringifySearch: stringifySearchFn,
  defaultPendingComponent: LoadingPlaceholder,
  context: {},
});

declare module "@tanstack/router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider {...reactOidcContextConfig}>
        <Suspense fallback={<p>root suspense loading...</p>}>
          <RouterProvider router={router} defaultPreload="intent" />
        </Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
