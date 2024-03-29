import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_auth/(reservations)/reservations/$reservationId/_details/"
)({
  loader: ({ params }) => {
    throw redirect({
      to: "/reservations/$reservationId/summary",
      params,
      replace: true,
    });
  },
});
