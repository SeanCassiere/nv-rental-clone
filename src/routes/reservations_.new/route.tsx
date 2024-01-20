import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod";

export const Route = new FileRoute("/reservations/new").createRoute({
  validateSearch: (search) =>
    z
      .object({
        stage: z.string().optional(),
      })
      .parse(search),
  preSearchFilters: [() => ({ stage: "rental-information" })],
  component: lazyRouteComponent(() => import("@/pages/add-reservation")),
});
