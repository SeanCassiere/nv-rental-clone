import { createRouteConfig, Outlet } from "@tanstack/react-router";

import AppShellLayout from "../components/AppShellLayout";

export const rootRoute = createRouteConfig({
  component: () => {
    return (
      <AppShellLayout>
        <Outlet />
      </AppShellLayout>
    );
  },
});
