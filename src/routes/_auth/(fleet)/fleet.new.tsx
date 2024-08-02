import { createFileRoute } from "@tanstack/react-router";

import { Container } from "@/routes/-components/container";

export const Route = createFileRoute("/_auth/(fleet)/fleet/new")({
  component: AddVehiclePage,
});

function AddVehiclePage() {
  return (
    <Container>
      <p>AddVehiclePage works!</p>
    </Container>
  );
}
