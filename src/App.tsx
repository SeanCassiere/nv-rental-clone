import { Suspense } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { router } from "./routes/Router";
import "./i18n.config";

// Create a client for react-query
export const queryClient = new QueryClient();

const App = () => {
  return (
    <Suspense fallback={<p>i18n loading...</p>}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Suspense>
  );
};

export default App;
