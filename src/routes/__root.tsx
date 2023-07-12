import { Outlet, RootRoute } from "@tanstack/router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { HeaderLayout } from "@/components/header/header-layout";
import { UI_APPLICATION_SHOW_ROUTER_DEVTOOLS } from "@/utils/constants";

export const rootRoute = new RootRoute({
  component: () => {
    return (
      <HeaderLayout>
        <Outlet />
        {UI_APPLICATION_SHOW_ROUTER_DEVTOOLS === true && (
          <TanStackRouterDevtools position="bottom-right" />
        )}
      </HeaderLayout>
    );
  },
});
