import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_auth/(fleet)/fleet/$vehicleId/_details/"
)({
  loader: ({ params }) => {
    throw redirect({
      to: "/fleet/$vehicleId/summary",
      params,
      replace: true,
    });
  },
});
