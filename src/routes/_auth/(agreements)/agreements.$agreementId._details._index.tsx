import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_auth/(agreements)/agreements/$agreementId/_details/index"
)({
  loader: ({ params }) => {
    throw redirect({
      to: "/agreements/$agreementId/summary",
      params,
      replace: true,
    });
  },
});
