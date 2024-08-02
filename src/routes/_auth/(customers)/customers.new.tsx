import { createFileRoute } from "@tanstack/react-router";

import { Container } from "@/routes/-components/container";

export const Route = createFileRoute("/_auth/(customers)/customers/new")({
  component: AddCustomerPage,
});

function AddCustomerPage() {
  return (
    <Container>
      <p>AddCustomerPage works!</p>
    </Container>
  );
}
