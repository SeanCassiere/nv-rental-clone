import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_auth/settings/$destination/")({
  parseParams: (params) => ({
    destination: z.string().parse(params.destination),
  }),
  stringifyParams: (params) => ({
    destination: `${params.destination}`,
  }),
  validateSearch: (search) =>
    z
      .object({
        tab: z.string().optional(),
      })
      .parse(search),
  preSearchFilters: [(prev) => prev],
});
