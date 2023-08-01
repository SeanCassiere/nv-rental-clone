import { Suspense } from "react";
import { Router, RouterProvider } from "@tanstack/router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { OidcAuthProvider } from "@/components/oidc-auth-provider";
import LoadingPlaceholder from "@/components/loading-placeholder";

import {
  routeTree,
  stringifySearchFn,
  parseSearchFn,
} from "@/tanstack-router-config";
import { queryClient } from "@/tanstack-query-config";
import "./i18n.config";

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
      <OidcAuthProvider>
        <Suspense fallback={<p>root suspense loading...</p>}>
          <RouterProvider router={router} defaultPreload="intent" />
        </Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
      </OidcAuthProvider>
    </QueryClientProvider>
  );
};

export default App;
