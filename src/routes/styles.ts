import { lazy } from "@tanstack/react-router";

import { rootRoute } from "./__root";

export const stylingRoute = rootRoute.createRoute({
  path: "styles",
  component: lazy(() => import("../pages/StylingArea/StylingAreaPage")),
});
