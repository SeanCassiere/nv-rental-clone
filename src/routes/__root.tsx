import { Outlet, RootRoute } from "@tanstack/router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import AppHeaderLayout from "../components/app-header-layout";
import { UI_APPLICATION_SHOW_ROUTER_DEVTOOLS } from "../utils/constants";

export const rootRoute = new RootRoute({
  component: () => {
    return (
      <AppHeaderLayout>
        <Outlet />
        {UI_APPLICATION_SHOW_ROUTER_DEVTOOLS === true && (
          <TanStackRouterDevtools position="bottom-right" />
        )}
      </AppHeaderLayout>
    );
  },
});
