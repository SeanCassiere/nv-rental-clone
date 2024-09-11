import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/(settings)/settings/")({
  beforeLoad: () => {
    throw redirect({ to: "/settings/profile", replace: true });
  },
});
