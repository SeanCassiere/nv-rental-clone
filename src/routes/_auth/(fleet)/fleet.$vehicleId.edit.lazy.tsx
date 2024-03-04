import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/(fleet)/fleet/$vehicleId/edit")({
  component: EditVehiclePage,
});

function EditVehiclePage() {
  return "Edit Fleet Route";
}
