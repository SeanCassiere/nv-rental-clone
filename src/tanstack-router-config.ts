import { parseSearchWith, stringifySearchWith } from "@tanstack/react-router";
import JSURL from "jsurl2";

import { rootRoute } from "@/routes/__root";
import { agreementsRoute } from "@/routes/agreements";
import { addAgreementRoute } from "@/routes/agreements/add-agreement-route";
import {
  agreementPathIdRoute,
  checkinAgreementByIdRoute,
  editAgreementByIdRoute,
  viewAgreementByIdRoute,
} from "@/routes/agreements/agreement-id-route";
import { searchAgreementsRoute } from "@/routes/agreements/search-agreements-route";
import { customersRoute } from "@/routes/customers";
import { addCustomerRoute } from "@/routes/customers/add-customer-route";
import {
  customerPathIdRoute,
  editCustomerByIdRoute,
  viewCustomerByIdRoute,
} from "@/routes/customers/customer-id-route";
import { searchCustomersRoute } from "@/routes/customers/search-customers-route";
import { fleetRoute } from "@/routes/fleet";
import { addFleetRoute } from "@/routes/fleet/add-fleet-route";
import {
  editFleetByIdRoute,
  fleetPathIdRoute,
  viewFleetByIdRoute,
} from "@/routes/fleet/fleet-id-route";
import { searchFleetRoute } from "@/routes/fleet/search-fleet-route";
import { indexRoute } from "@/routes/index";
import { loggedOutRoute } from "@/routes/logged-out";
import { logoutRoute } from "@/routes/logout";
import { oidcCallbackRoute } from "@/routes/oidc-callback";
import { reportsRoute } from "@/routes/reports";
import {
  reportPathIdRoute,
  viewReportByIdRoute,
} from "@/routes/reports/report-id-route";
import { searchReportsRoute } from "@/routes/reports/search-reports-route";
import { reservationsRoute } from "@/routes/reservations";
import { addReservationRoute } from "@/routes/reservations/add-reservation-route";
import {
  editReservationByIdRoute,
  reservationPathIdRoute,
  viewReservationByIdRoute,
} from "@/routes/reservations/reservation-id-route";
import { searchReservationsRoute } from "@/routes/reservations/search-reservations-route";
import { settingsRoute } from "@/routes/settings";
import { destinationSettingsRoute } from "@/routes/settings/destination-settings-route";
import { mainSettingsRoute } from "@/routes/settings/main-settings-route";
import { stylingRoute } from "@/routes/styles";

import { OIDC_REDIRECT_URI } from "@/utils/constants";

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

export const parseSearchFn = parseSearchWith((value) => JSURL.parse(value));
// export const parseSearchFn = parseSearchWith((value) => JSON.parse(decodeFromBinary(value)));

export const stringifySearchFn = stringifySearchWith((value) =>
  JSURL.stringify(value)
);
// export const stringifySearchFn = stringifySearchWith((value) =>
//   encodeToBinary(JSON.stringify(value))
// );

export const routeTree = rootRoute.addChildren([
  indexRoute, // /
  logoutRoute, // /logout
  loggedOutRoute, // /logged-out
  oidcCallbackRoute, // /oidc-callback
  ...(!OIDC_REDIRECT_URI.startsWith("https://") ? [stylingRoute] : []),
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
  reportsRoute.addChildren([
    searchReportsRoute, // /reports
    reportPathIdRoute.addChildren([
      viewReportByIdRoute, // /reports/:reportId
    ]),
  ]),
  settingsRoute.addChildren([
    mainSettingsRoute, // /settings
    destinationSettingsRoute, // /settings/destinations
  ]),
]);
