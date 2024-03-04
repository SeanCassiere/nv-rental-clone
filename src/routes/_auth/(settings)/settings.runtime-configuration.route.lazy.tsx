import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/_auth/(settings)/settings/runtime-configuration"
)({
  component: () => <div>Hello /_auth/settings/runtime-configuration!</div>,
});
