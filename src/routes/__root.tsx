import { Outlet, RootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import AppShellLayout from "../components/AppShellLayout";

export const rootRoute = new RootRoute({
  component: () => {
    return (
      <AppShellLayout>
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
      </AppShellLayout>
    );
  },
});
