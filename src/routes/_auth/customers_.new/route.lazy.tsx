import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/customers/new")({
  component: AddCustomerPage,
});

function AddCustomerPage() {
  return "Add Customer Route";
}
