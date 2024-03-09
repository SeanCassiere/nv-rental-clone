import { createLazyFileRoute } from "@tanstack/react-router";

import { Container } from "@/routes/-components/container";

export const Route = createLazyFileRoute("/_auth/(customers)/customers/new")({
  component: AddCustomerPage,
});

function AddCustomerPage() {
  return (
    <Container>
      <p>AddCustomerPage works!</p>
    </Container>
  );
}
