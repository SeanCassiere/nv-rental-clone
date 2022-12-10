import {
  Outlet,
  createReactRouter,
  createRouteConfig,
} from "@tanstack/react-router";
import { z } from "zod";

import AgreementsPage from "../pages/Agreements";
import IndexPage from "../pages/Index";
import { OidcAuthProvider } from "./OidcAuthProvider";

const rootRoute = createRouteConfig({
  component: () => {
    return (
      <OidcAuthProvider>
        <Outlet />
      </OidcAuthProvider>
    );
  },
});

const indexRoute = rootRoute.createRoute({
  path: "/",
  component: IndexPage,
});

const agreementsRoute = rootRoute.createRoute({
  path: "/agreements",
  component: AgreementsPage,
  validateSearch: z.object({
    page: z.number().default(1),
    size: z.number().default(20),
  }).parse,
  preSearchFilters: [
    (search) => ({
      page: search.page || 1,
      size: search.size || 20,
    }),
  ],
});

const routeConfig = rootRoute.addChildren([indexRoute, agreementsRoute]);

export const router = createReactRouter({ routeConfig });
