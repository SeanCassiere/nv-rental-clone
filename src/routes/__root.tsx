import { Outlet, RootRoute } from "@tanstack/react-router";

import AppShellLayout from "../components/AppShellLayout";

export const rootRoute = new RootRoute({
  component: () => {
    return (
      <AppShellLayout>
        <Outlet />
      </AppShellLayout>
    );
  },
});
