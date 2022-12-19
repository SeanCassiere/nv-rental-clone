import { createRouteConfig, Outlet } from "@tanstack/react-router";
import { z } from "zod";

import { OidcAuthProvider } from "./OidcAuthProvider";
import IndexPage from "../pages/Index/IndexPage";
import LoggedOutPage from "../pages/LoggedOut/LoggedOutPage";
import AgreementsSearchPage from "../pages/AgreementsSearch/AgreementsSearchPage";
import AgreementViewPage from "../pages/AgreementView/AgreementViewPage";
import CustomerSearchPage from "../pages/CustomerSearch/CustomerSearchPage";
import ReservationsSearchPage from "../pages/ReservationsSearch/ReservationsSearchPage";
import VehiclesSearchPage from "../pages/VehiclesSearch/VehiclesSearchPage";
import ReservationViewPage from "../pages/ReservationView/ReservationViewPage";

import { AgreementFiltersSchema } from "../utils/schemas/agreement";
import { CustomerFiltersSchema } from "../utils/schemas/customer";
import { ReservationFiltersSchema } from "../utils/schemas/reservation";
import { VehicleFiltersSchema } from "../utils/schemas/vehicle";

export const rootRoute = createRouteConfig({
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

const loggedOutRoute = rootRoute.createRoute({
  path: "/logged-out",
  component: LoggedOutPage,
});

// Agreement Routes
const agreementsRoute = rootRoute.createRoute({ path: "agreements" });
const agreementsIndexRoute = agreementsRoute.createRoute({
  path: "/",
  component: AgreementsSearchPage,
  validateSearch: z.object({
    page: z.number().min(1).default(1),
    size: z.number().min(1).default(10),
    filters: AgreementFiltersSchema.optional(),
  }).parse,
  preSearchFilters: [
    (search) => ({
      page: search.page || 1,
      size: search.size || 10,
    }),
  ],
});
const viewAgreementRoute = agreementsRoute.createRoute({
  path: "$agreementId",
  component: AgreementViewPage,
});

// Customer Routes
const customersRoute = rootRoute.createRoute({ path: "customers" });
const customersIndexRoute = customersRoute.createRoute({
  path: "/",
  component: CustomerSearchPage,
  validateSearch: z.object({
    page: z.number().min(1).default(1),
    size: z.number().min(1).default(10),
    filters: CustomerFiltersSchema.optional(),
  }).parse,
  preSearchFilters: [
    (search) => ({
      page: search.page || 1,
      size: search.size || 10,
    }),
  ],
});

// Reservation Routes
const reservationsRoute = rootRoute.createRoute({ path: "reservations" });
const reservationsIndexRoute = reservationsRoute.createRoute({
  path: "/",
  component: ReservationsSearchPage,
  validateSearch: z.object({
    page: z.number().min(1).default(1),
    size: z.number().min(1).default(10),
    filters: ReservationFiltersSchema.optional(),
  }).parse,
  preSearchFilters: [
    (search) => ({
      page: search.page || 1,
      size: search.size || 10,
    }),
  ],
});
const viewReservationRoute = reservationsRoute.createRoute({
  path: "$reservationId",
  component: ReservationViewPage,
});

// Vehicle Routes
const vehiclesRoute = rootRoute.createRoute({ path: "vehicles" });
const vehiclesIndexRoute = vehiclesRoute.createRoute({
  path: "/",
  component: VehiclesSearchPage,
  validateSearch: z.object({
    page: z.number().min(1).default(1),
    size: z.number().min(1).default(10),
    filters: VehicleFiltersSchema.optional(),
  }).parse,
  preSearchFilters: [
    (search) => ({
      page: search.page || 1,
      size: search.size || 10,
    }),
  ],
});

export const routeConfig = rootRoute.addChildren([
  indexRoute,
  loggedOutRoute,
  agreementsRoute.addChildren([agreementsIndexRoute, viewAgreementRoute]),
  reservationsRoute.addChildren([reservationsIndexRoute, viewReservationRoute]),
  customersRoute.addChildren([customersIndexRoute]),
  vehiclesRoute.addChildren([vehiclesIndexRoute]),
]);
