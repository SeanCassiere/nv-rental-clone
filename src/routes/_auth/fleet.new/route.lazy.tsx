import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/fleet/new")({
  component: AddVehiclePage,
});

function AddVehiclePage() {
  return "Add Fleet Route";
}
