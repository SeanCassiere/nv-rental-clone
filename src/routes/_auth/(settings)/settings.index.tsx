import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/(settings)/settings/index")({
  beforeLoad: () => {
    throw redirect({ to: "/settings/profile", replace: true });
  },
});
