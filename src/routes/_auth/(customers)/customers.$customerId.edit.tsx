import { createFileRoute } from "@tanstack/react-router";

import { Container } from "@/routes/-components/container";

export const Route = createFileRoute(
  "/_auth/(customers)/customers/$customerId/edit"
)({
  component: EditCustomerPage,
});

function EditCustomerPage() {
  return (
    <Container>
      <p>EditCustomerPage works!</p>
    </Container>
  );
}
