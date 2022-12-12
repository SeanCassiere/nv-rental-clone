import {
  Outlet,
  createReactRouter,
  createRouteConfig,
  parseSearchWith,
  stringifySearchWith,
} from "@tanstack/react-router";

import { OidcAuthProvider } from "./OidcAuthProvider";
import { indexRoute } from "../pages/Index/IndexPage";
import { agreementsSearchRoute } from "../pages/AgreementsSearch/AgreementsSearchPage";

export const rootRoute = createRouteConfig({
  component: () => {
    return (
      <OidcAuthProvider>
        <Outlet />
      </OidcAuthProvider>
    );
  },
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
