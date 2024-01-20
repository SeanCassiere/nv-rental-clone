import { FileRoute } from "@tanstack/react-router";

export const Route = new FileRoute("/fleet/new").createRoute({
  component: () => "Add Fleet Route",
});
