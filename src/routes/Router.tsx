import {
  Outlet,
  createReactRouter,
  createRouteConfig,
  parseSearchWith,
  stringifySearchWith,
} from "@tanstack/react-router";
import { z } from "zod";

import { OidcAuthProvider } from "./OidcAuthProvider";
import IndexPage from "../pages/Index";
import AgreementsPage from "../pages/Agreements";

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

const agreementFiltersModel = z
  .object({
    AgreementStatusName: z.string().optional(),
    Statuses: z.number().optional(),
    IsSearchOverdues: z.boolean().optional(),
    EndDate: z
      .preprocess((arg) => {
        if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
      }, z.date())
      .optional(),
  })
  .optional();

export const agreementsSearchRoute = rootRoute.createRoute({
  path: "/agreements",
  component: AgreementsPage,
  validateSearch: z.object({
    page: z.number().min(1).default(1),
    size: z.number().min(1).default(10),
    filters: agreementFiltersModel,
  }).parse,
  preSearchFilters: [
    (search) => ({
      page: search.page || 1,
      size: search.size || 10,
    }),
  ],
});

const routeConfig = rootRoute.addChildren([indexRoute, agreementsSearchRoute]);

export const router = createReactRouter({
  routeConfig,
  parseSearch: parseSearchWith((value) => JSON.parse(decodeFromBinary(value))),
  stringifySearch: stringifySearchWith((value) =>
    encodeToBinary(JSON.stringify(value))
  ),
});

export function decodeFromBinary(str: string): string {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}

export function encodeToBinary(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    })
  );
}
