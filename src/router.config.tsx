import {
  ReactRouter,
  parseSearchWith,
  stringifySearchWith,
} from "@tanstack/react-router";
import JSURL from "jsurl2";

import { rootRoute } from "./routes/__root";

// /
import { indexRoute } from "./routes";

// /logged-out
import { loggedOutRoute } from "./routes/logged-out";

// /styles
import { stylingRoute } from "./routes/styles";

// /agreements
import { agreementsRoute } from "./routes/agreements";
import { searchAgreementsRoute } from "./routes/agreements/searchAgreements";
import { viewAgreementRoute } from "./routes/agreements/viewAgreement";

// /customers
import { customersRoute } from "./routes/customers";
import { searchCustomersRoute } from "./routes/customers/searchCustomers";
import { viewCustomerRoute } from "./routes/customers/viewCustomer";

// /reservations
import { reservationsRoute } from "./routes/reservations";
import { searchReservationsRoute } from "./routes/reservations/searchReservations";
import { viewReservationRoute } from "./routes/reservations/viewReservation";

// /fleet
import { fleetRoute } from "./routes/fleet";
import { searchFleetRoute } from "./routes/fleet/searchFleet";
import { viewFleetRoute } from "./routes/fleet/viewFleet";

const routeTree = rootRoute.addChildren([
  indexRoute,
  loggedOutRoute,
  stylingRoute,
  agreementsRoute.addChildren([
    // /agreements/:agreementId
    viewAgreementRoute,
    // /agreements
    searchAgreementsRoute,
  ]),
  customersRoute.addChildren([
    // /customers
    searchCustomersRoute,
    // /customers/:customerId
    viewCustomerRoute,
  ]),
  reservationsRoute.addChildren([
    // /reservations
    searchReservationsRoute,
    // /reservations/:reservationId
    viewReservationRoute,
  ]),
  fleetRoute.addChildren([
    // /fleet
    searchFleetRoute,
    // /fleet/:fleetId
    viewFleetRoute,
  ]),
]);

export const router = new ReactRouter({
  routeTree,
  parseSearch: parseSearchWith((value) => JSURL.parse(value)),
  stringifySearch: stringifySearchWith((value) => JSURL.stringify(value)),
  // parseSearch: parseSearchWith((value) => JSON.parse(decodeFromBinary(value))),
  // stringifySearch: stringifySearchWith((value) =>
  //   encodeToBinary(JSON.stringify(value))
  // ),
  defaultPendingComponent: () => (
    <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center text-3xl">
      <div>Code-split loading...</div>
    </div>
  ),
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

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
