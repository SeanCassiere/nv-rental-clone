import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/_auth/(settings)/settings/rates-and-charges"
)({
  component: () => <div>Hello /_auth/settings/rates-and-charges!</div>,
});
