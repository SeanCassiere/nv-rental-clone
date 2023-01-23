import { Suspense } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuth, type AuthContext } from "react-oidc-context";

import { OidcAuthProvider } from "./components/OidcAuthProvider";
import { router } from "./router.config";
import "./i18n.config";

// Create a client for react-query
export const queryClient = new QueryClient();

const App = () => {
  return (
    <Suspense fallback={<p>root suspense loading...</p>}>
      <QueryClientProvider client={queryClient}>
        <OidcAuthProvider>
          <SubApp />
          <ReactQueryDevtools initialIsOpen={false} />
        </OidcAuthProvider>
      </QueryClientProvider>
    </Suspense>
  );
};

const SubApp = () => {
  return (
    <>
      <RouterProvider
        router={router}
        context={{ auth: useAuth() }}
        defaultPreload="intent"
      />
    </>
  );
};

declare module "@tanstack/react-router" {
  interface RouterContext {
    auth: typeof AuthContext;
  }
}

export default App;
