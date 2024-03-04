import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute(
  "/_auth/(reservations)/reservations/$reservationId/"
)({
  validateSearch: (search) =>
    z
      .object({
        tab: z.string().optional(),
      })
      .parse(search),
  preSearchFilters: [(search) => ({ tab: search?.tab || "summary" })],
  beforeLoad: ({ search }) => {
    return {
      viewTab: search?.tab || "",
    };
  },
  loader: async ({ context }) => {
    if (!context.auth.isAuthenticated) return;

    switch (context.viewTab.trim().toLowerCase()) {
      case "notes":
        break;
      case "summary":
      default:
        break;
    }

    return;
  },
});
