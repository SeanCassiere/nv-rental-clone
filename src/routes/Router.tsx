import {
  ReactRouter,
  parseSearchWith,
  stringifySearchWith,
} from "@tanstack/react-router";

import { rootRoute } from "./routing/__root";

// /
import { indexRoute } from "./routing";

// /logged-out
import { loggedOutRoute } from "./routing/logged-out";

// /styles
import { stylingRoute } from "./routing/styles";

// /agreements
import { agreementsRoute } from "./routing/agreements";
import { searchAgreementsRoute } from "./routing/agreements/searchAgreements";
import { viewAgreementRoute } from "./routing/agreements/viewAgreement";

// /customers
import { customersRoute } from "./routing/customers";
import { searchCustomersRoute } from "./routing/customers/searchCustomers";
import { viewCustomerRoute } from "./routing/customers/viewCustomer";

// /reservations
import { reservationsRoute } from "./routing/reservations";
import { searchReservationsRoute } from "./routing/reservations/searchReservations";
import { viewReservationRoute } from "./routing/reservations/viewReservation";

// /vehicles
import { vehiclesRoute } from "./routing/vehicles";
import { searchVehiclesRoute } from "./routing/vehicles/searchVehicles";
import { viewVehicleRoute } from "./routing/vehicles/viewVehicle";

const routeConfig = rootRoute.addChildren([
  indexRoute,
  loggedOutRoute,
  stylingRoute,
  agreementsRoute.addChildren([searchAgreementsRoute, viewAgreementRoute]),
  reservationsRoute.addChildren([
    searchReservationsRoute,
    viewReservationRoute,
  ]),
  customersRoute.addChildren([searchCustomersRoute, viewCustomerRoute]),
  vehiclesRoute.addChildren([searchVehiclesRoute, viewVehicleRoute]),
]);

declare module "@tanstack/react-router" {
  interface RegisterRouter {
    router: typeof router;
  }
}

export const router = new ReactRouter({
  routeConfig,
  parseSearch: parseSearchWith((value) => JSON.parse(decodeFromBinary(value))),
  stringifySearch: stringifySearchWith((value) =>
    encodeToBinary(JSON.stringify(value))
  ),
  defaultPendingComponent: () => (
    <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center text-3xl">
      <div>Code-split loading...</div>
    </div>
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
