import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/settings-temp")({
  component: () => <div>Hello /_auth/settings-temp!</div>,
});
