import { Outlet, RootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import AppShellLayout from "../components/AppShellLayout";
import { UI_APPLICATION_SHOW_ROUTER_DEVTOOLS } from "../utils/constants";

export const rootRoute = new RootRoute({
  component: () => {
    return (
      <AppShellLayout>
        <Outlet />
        {UI_APPLICATION_SHOW_ROUTER_DEVTOOLS === true && (
          <TanStackRouterDevtools position="bottom-right" />
        )}
      </AppShellLayout>
    );
  },
});
