import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const tRoute = new FileRoute("/logged-out").createRoute({
  component: lazyRouteComponent(() => import("@/pages/logged-out")),
});
