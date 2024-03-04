import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute(
  "/_auth/(customers)/customers/$customerId/"
)({
  validateSearch: (search) =>
    z.object({ tab: z.string().optional() }).parse(search),
  preSearchFilters: [(search) => ({ tab: search?.tab || "summary" })],
});
