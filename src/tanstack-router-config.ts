import { parseSearchWith, stringifySearchWith } from "@tanstack/react-router";
import JSURL from "jsurl2";

// import { Route } from "@/routes/__root";
// import { indexRoute } from "@/routes/index";

// import { IS_LOCAL_DEV } from "@/utils/constants";

// import { agreementsRoute } from "@/temp-routes/agreements";
// import { addAgreementRoute } from "@/temp-routes/agreements/add-agreement-route";
// import {
//   agreementPathIdRoute,
//   checkinAgreementByIdRoute,
//   editAgreementByIdRoute,
//   viewAgreementByIdRoute,
// } from "@/temp-routes/agreements/agreement-id-route";
// import { searchAgreementsRoute } from "@/temp-routes/agreements/search-agreements-route";
// import { customersRoute } from "@/temp-routes/customers";
// import { addCustomerRoute } from "@/temp-routes/customers/add-customer-route";
// import {
//   customerPathIdRoute,
//   editCustomerByIdRoute,
//   viewCustomerByIdRoute,
// } from "@/temp-routes/customers/customer-id-route";
// import { searchCustomersRoute } from "@/temp-routes/customers/search-customers-route";
// import { devRoute } from "@/temp-routes/dev";
// import { fleetRoute } from "@/temp-routes/fleet";
// import { addFleetRoute } from "@/temp-routes/fleet/add-fleet-route";
// import {
//   editFleetByIdRoute,
//   fleetPathIdRoute,
//   viewFleetByIdRoute,
// } from "@/temp-routes/fleet/fleet-id-route";
// import { searchFleetRoute } from "@/temp-routes/fleet/search-fleet-route";
// import { loggedOutRoute } from "@/temp-routes/logged-out";
// import { logoutRoute } from "@/temp-routes/logout";
// import { oidcCallbackRoute } from "@/temp-routes/oidc-callback";
// import { reportsRoute } from "@/temp-routes/reports";
// import {
//   reportPathIdRoute,
//   viewReportByIdRoute,
// } from "@/temp-routes/reports/report-id-route";
// import { searchReportsRoute } from "@/temp-routes/reports/search-reports-route";
// import { reservationsRoute } from "@/temp-routes/reservations";
// import { addReservationRoute } from "@/temp-routes/reservations/add-reservation-route";
// import {
//   editReservationByIdRoute,
//   reservationPathIdRoute,
//   viewReservationByIdRoute,
// } from "@/temp-routes/reservations/reservation-id-route";
// import { searchReservationsRoute } from "@/temp-routes/reservations/search-reservations-route";
// import { settingsRoute } from "@/temp-routes/settings";
// import { destinationSettingsRoute } from "@/temp-routes/settings/destination-settings-route";
// import { mainSettingsRoute } from "@/temp-routes/settings/main-settings-route";

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

// export const routeTree = Route.addChildren([
//   agreementsRoute.addChildren([
//     searchAgreementsRoute, // /agreements
//     addAgreementRoute, // /agreements/new
//     agreementPathIdRoute.addChildren([
//       // /agreements/:agreementId
//       viewAgreementByIdRoute, // /agreements/:agreementId/
//       editAgreementByIdRoute, // /agreements/:agreementId/edit
//       checkinAgreementByIdRoute, // /agreements/:agreementId/check-in
//     ]),
//   ]),
//   customersRoute.addChildren([
//     searchCustomersRoute, // /customers
//     addCustomerRoute, // /customers/new
//     customerPathIdRoute.addChildren([
//       // /customers/:customerId
//       viewCustomerByIdRoute, // /customers/:customerId/
//       editCustomerByIdRoute, // /customers/:customerId/edit
//     ]),
//   ]),
//   reservationsRoute.addChildren([
//     searchReservationsRoute, // /reservations
//     addReservationRoute, // /reservations/new
//     reservationPathIdRoute.addChildren([
//       // /reservations/:reservationId
//       viewReservationByIdRoute, // /reservations/:reservationId/
//       editReservationByIdRoute, // /reservations/:reservationId/edit
//     ]),
//   ]),
//   fleetRoute.addChildren([
//     searchFleetRoute, // /fleet
//     addFleetRoute, // /fleet/new
//     fleetPathIdRoute.addChildren([
//       // /fleet/:fleetId
//       viewFleetByIdRoute, // /fleet/:fleetId/
//       editFleetByIdRoute, // /fleet/:fleetId/edit
//     ]),
//   ]),
//   reportsRoute.addChildren([
//     searchReportsRoute, // /reports
//     reportPathIdRoute.addChildren([
//       viewReportByIdRoute, // /reports/:reportId
//     ]),
//   ]),
//   settingsRoute.addChildren([
//     mainSettingsRoute, // /settings
//     destinationSettingsRoute, // /settings/destinations
//   ]),
//   logoutRoute, // /logout
//   loggedOutRoute, // /logged-out
//   oidcCallbackRoute, // /oidc-callback
//   ...(IS_LOCAL_DEV ? [devRoute] : []),
//   indexRoute, // /
// ]);
