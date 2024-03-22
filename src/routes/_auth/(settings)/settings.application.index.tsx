import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/(settings)/settings/application/")(
  {
    loader: () => {
      throw redirect({ to: "/settings/application/users", replace: true });
    },
  }
);
