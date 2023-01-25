import { lazy, Route } from "@tanstack/react-router";

import { rootRoute } from "./__root";

export const stylingRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "styles",
  component: lazy(() => import("../pages/StylingArea/StylingAreaPage")),
});
