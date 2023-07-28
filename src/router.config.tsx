import { Router, parseSearchWith, stringifySearchWith } from "@tanstack/router";
import JSURL from "jsurl2";

import LoadingPlaceholder from "./components/loading-placeholder";
import { rootRoute } from "./routes/__root";

// /
import { indexRoute } from "./routes";

// /logged-out
import { loggedOutRoute } from "./routes/logged-out";

// /oidc-callback
import { oidcCallbackRoute } from "@/routes/oidc-callback";

// /styles
import { stylingRoute } from "./routes/styles";

// /agreements
import { agreementsRoute } from "./routes/agreements";
import { searchAgreementsRoute } from "./routes/agreements/search-agreements-route";
import { addAgreementRoute } from "./routes/agreements/add-agreement-route";
import {
  agreementPathIdRoute,
  viewAgreementByIdRoute,
  editAgreementByIdRoute,
  checkinAgreementByIdRoute,
} from "./routes/agreements/agreement-id-route";

// /customers
import { customersRoute } from "./routes/customers";
import { searchCustomersRoute } from "./routes/customers/search-customers-route";
import { addCustomerRoute } from "./routes/customers/add-customer-route";
import {
  customerPathIdRoute,
  viewCustomerByIdRoute,
  editCustomerByIdRoute,
} from "./routes/customers/customer-id-route";

// /reservations
import { reservationsRoute } from "./routes/reservations";
import { searchReservationsRoute } from "./routes/reservations/search-reservations-route";
import { addReservationRoute } from "./routes/reservations/add-reservation-route";
import {
  reservationPathIdRoute,
  viewReservationByIdRoute,
  editReservationByIdRoute,
} from "./routes/reservations/reservation-id-route";

// /fleet
import { fleetRoute } from "./routes/fleet";
import { searchFleetRoute } from "./routes/fleet/search-fleet-route";
import { addFleetRoute } from "./routes/fleet/add-fleet-route";
import {
  fleetPathIdRoute,
  viewFleetByIdRoute,
  editFleetByIdRoute,
} from "./routes/fleet/fleet-id-route";

import { settingsRoute } from "./routes/settings";
import { mainSettingsRoute } from "./routes/settings/main-settings-route";
import { destinationSettingsRoute } from "./routes/settings/destination-settings-route";

const routeTree = rootRoute.addChildren([
  indexRoute, // /
  loggedOutRoute, // /logged-out
  oidcCallbackRoute, // /oidc-callback
  ...(import.meta.env?.NODE_ENV !== "production" ? [stylingRoute] : []),
  agreementsRoute.addChildren([
    searchAgreementsRoute, // /agreements
    addAgreementRoute, // /agreements/new
    agreementPathIdRoute.addChildren([
      // /agreements/:agreementId
      viewAgreementByIdRoute, // /agreements/:agreementId/
      editAgreementByIdRoute, // /agreements/:agreementId/edit
      checkinAgreementByIdRoute, // /agreements/:agreementId/check-in
    ]),
  ]),
  customersRoute.addChildren([
    searchCustomersRoute, // /customers
    addCustomerRoute, // /customers/new
    customerPathIdRoute.addChildren([
      // /customers/:customerId
      viewCustomerByIdRoute, // /customers/:customerId/
      editCustomerByIdRoute, // /customers/:customerId/edit
    ]),
  ]),
  reservationsRoute.addChildren([
    searchReservationsRoute, // /reservations
    addReservationRoute, // /reservations/new
    reservationPathIdRoute.addChildren([
      // /reservations/:reservationId
      viewReservationByIdRoute, // /reservations/:reservationId/
      editReservationByIdRoute, // /reservations/:reservationId/edit
    ]),
  ]),
  fleetRoute.addChildren([
    searchFleetRoute, // /fleet
    addFleetRoute, // /fleet/new
    fleetPathIdRoute.addChildren([
      // /fleet/:fleetId
      viewFleetByIdRoute, // /fleet/:fleetId/
      editFleetByIdRoute, // /fleet/:fleetId/edit
    ]),
  ]),
  settingsRoute.addChildren([
    mainSettingsRoute, // /settings
    destinationSettingsRoute, // /settings/destinations
  ]),
]);

export const router = new Router({
  routeTree,
  parseSearch: parseSearchWith((value) => JSURL.parse(value)),
  stringifySearch: stringifySearchWith((value) => JSURL.stringify(value)),
  // parseSearch: parseSearchWith((value) => JSON.parse(decodeFromBinary(value))),
  // stringifySearch: stringifySearchWith((value) =>
  //   encodeToBinary(JSON.stringify(value))
  // ),
  defaultPendingComponent: LoadingPlaceholder,
  defaultPreload: "intent",
});

declare module "@tanstack/router" {
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
