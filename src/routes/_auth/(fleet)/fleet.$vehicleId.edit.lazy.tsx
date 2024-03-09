import { createLazyFileRoute } from "@tanstack/react-router";

import { Container } from "@/routes/-components/container";

export const Route = createLazyFileRoute(
  "/_auth/(fleet)/fleet/$vehicleId/edit"
)({
  component: EditVehiclePage,
});

function EditVehiclePage() {
  return (
    <Container>
      <p>EditVehiclePage works!</p>
    </Container>
  );
}
