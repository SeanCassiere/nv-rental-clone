import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/(customers)/customers/$customerId/edit")({
  component: EditCustomerPage,
});

function EditCustomerPage() {
  return "Edit Customer Route";
}
