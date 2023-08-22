import { Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Router, RouterProvider } from "@tanstack/react-router";
import { AuthProvider } from "react-oidc-context";

import { LoadingPlaceholder } from "@/components/loading-placeholder";
import { TailwindScreenDevTool } from "@/components/tailwind-screen-dev-tool";
import { Toaster } from "@/components/ui/toaster";

import { apiClient } from "@/api";
import { reactOidcContextConfig } from "@/react-oidc-context-config";
import { queryClient } from "@/tanstack-query-config";
import {
  parseSearchFn,
  routeTree,
  stringifySearchFn,
} from "@/tanstack-router-config";

import "./i18next-config";

export const router = new Router({
  routeTree,
  defaultPreload: "intent",
  parseSearch: parseSearchFn,
  stringifySearch: stringifySearchFn,
  defaultPendingComponent: LoadingPlaceholder,
  context: {
    apiClient,
    queryClient,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider {...reactOidcContextConfig}>
          <Suspense fallback={<p>root suspense loading...</p>}>
            <RouterProvider router={router} defaultPreload="intent" />
          </Suspense>
          <ReactQueryDevtools initialIsOpen={false} />
          <TailwindScreenDevTool />
        </AuthProvider>
      </QueryClientProvider>
      <Toaster />
    </>
  );
};

export default App;
