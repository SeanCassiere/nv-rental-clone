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
import { addAgreementRoute } from "./routes/agreements/addAgreement";
import {
  agreementPathIdRoute,
  viewAgreementByIdRoute,
  editAgreementByIdRoute,
} from "./routes/agreements/agreementIdPath";

// /customers
import { customersRoute } from "./routes/customers";
import { searchCustomersRoute } from "./routes/customers/searchCustomers";
import { addCustomerRoute } from "./routes/customers/addCustomer";
import {
  customerPathIdRoute,
  viewCustomerByIdRoute,
  editCustomerByIdRoute,
} from "./routes/customers/customerIdPath";

// /reservations
import { reservationsRoute } from "./routes/reservations";
import { searchReservationsRoute } from "./routes/reservations/searchReservations";
import { addReservationRoute } from "./routes/reservations/addReservation";
import {
  reservationPathIdRoute,
  viewReservationByIdRoute,
  editReservationByIdRoute,
} from "./routes/reservations/reservationIdPath";

// /fleet
import { fleetRoute } from "./routes/fleet";
import { searchFleetRoute } from "./routes/fleet/searchFleet";
import { addFleetRoute } from "./routes/fleet/addFleet";
import {
  fleetPathIdRoute,
  viewFleetByIdRoute,
  editFleetByIdRoute,
} from "./routes/fleet/fleetIdPath";

const routeTree = rootRoute.addChildren([
  indexRoute,
  loggedOutRoute,
  ...(import.meta.env?.NODE_ENV !== "production" ? [stylingRoute] : []),
  agreementsRoute.addChildren([
    // /agreements/add
    addAgreementRoute,
    // /agreements
    searchAgreementsRoute,
    // /agreements/:agreementId
    agreementPathIdRoute.addChildren([
      // /agreements/:agreementId/
      viewAgreementByIdRoute,
      // /agreements/:agreementId/edit
      editAgreementByIdRoute,
    ]),
  ]),
  customersRoute.addChildren([
    // /customers
    searchCustomersRoute,
    // /customers/add
    addCustomerRoute,
    // /customers/:customerId
    customerPathIdRoute.addChildren([
      // /customers/:customerId/
      viewCustomerByIdRoute,
      // /customers/:customerId/edit
      editCustomerByIdRoute,
    ]),
  ]),
  reservationsRoute.addChildren([
    // /reservations
    searchReservationsRoute,
    // /reservations/add
    addReservationRoute,
    // /reservations/:reservationId
    reservationPathIdRoute.addChildren([
      // /reservations/:reservationId/
      viewReservationByIdRoute,
      // /reservations/:reservationId/edit
      editReservationByIdRoute,
    ]),
  ]),
  fleetRoute.addChildren([
    // /fleet
    searchFleetRoute,
    // /fleet/add
    addFleetRoute,
    // /fleet/:fleetId
    fleetPathIdRoute.addChildren([
      // /fleet/:fleetId/
      viewFleetByIdRoute,
      // /fleet/:fleetId/edit
      editFleetByIdRoute,
    ]),
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
