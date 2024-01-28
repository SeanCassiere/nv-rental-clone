import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/_auth/settings-temp/vehicles-and-categories"
)({
  component: () => (
    <div>Hello /_auth/settings-temp/vehicles-and-categories!</div>
  ),
});
