import { FileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = new FileRoute("/_auth/agreements/new").createRoute({
  validateSearch: (search) =>
    z
      .object({
        stage: z.string().optional(),
      })
      .parse(search),
  preSearchFilters: [() => ({ stage: "rental-information" })],
});
