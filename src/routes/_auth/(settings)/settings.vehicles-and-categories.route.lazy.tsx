import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/_auth/(settings)/settings/vehicles-and-categories"
)({
  component: () => <div>Hello /_auth/settings/vehicles-and-categories!</div>,
});
