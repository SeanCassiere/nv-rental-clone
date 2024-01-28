import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/_auth/settings/application/locations"
)({
  component: () => <div>Hello /_auth/settings/application/locations!</div>,
});
