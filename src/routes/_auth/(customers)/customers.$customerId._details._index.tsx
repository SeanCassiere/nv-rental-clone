import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_auth/(customers)/customers/$customerId/_details/"
)({
  loader: ({ params }) => {
    throw redirect({
      to: "/customers/$customerId/summary",
      params,
      replace: true,
    });
  },
});
