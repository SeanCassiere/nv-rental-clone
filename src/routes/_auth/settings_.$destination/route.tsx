import { FileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = new FileRoute("/_auth/settings/$destination").createRoute({
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
