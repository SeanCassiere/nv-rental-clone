import { Route } from "@tanstack/router";

import { rootRoute } from "./__root";

export const oidcCallbackRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "oidc-callback",
  component: () => {
    return <div className="flex flex-1 justify-center items-center min-h-screen">/oidc-callback</div>
  },
});
