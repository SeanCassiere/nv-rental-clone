import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = new FileRoute("/dev").createRoute({
  component: lazyRouteComponent(() => import("@/pages/dev")),
});
