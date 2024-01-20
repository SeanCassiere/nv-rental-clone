import { FileRoute } from "@tanstack/react-router";

export const Route = new FileRoute("/fleet/$vehicleId/edit").createRoute({
  component: () => "Edit Vehicle Route",
});
