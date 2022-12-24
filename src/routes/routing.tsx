import { createRouteConfig, Outlet, lazy } from "@tanstack/react-router";
import { z } from "zod";

import { OidcAuthProvider } from "./OidcAuthProvider";
import AppShellLayout from "../components/AppShellLayout";

import { AgreementFiltersSchema } from "../utils/schemas/agreement";
import { CustomerFiltersSchema } from "../utils/schemas/customer";
import { ReservationFiltersSchema } from "../utils/schemas/reservation";
import { VehicleFiltersSchema } from "../utils/schemas/vehicle";

export const rootRoute = createRouteConfig({
  component: () => {
    return (
      <OidcAuthProvider>
        <AppShellLayout>
          <Outlet />
        </AppShellLayout>
      </OidcAuthProvider>
    );
  },
});

const indexRoute = rootRoute.createRoute({
  path: "/",
  component: lazy(() => import("../pages/Index/IndexPage")),
});

const loggedOutRoute = rootRoute.createRoute({
  path: "/logged-out",
  component: lazy(() => import("../pages/LoggedOut/LoggedOutPage")),
});

// Agreement Routes
const agreementsRoute = rootRoute.createRoute({ path: "agreements" });
const agreementsIndexRoute = agreementsRoute.createRoute({
  path: "/",
  component: lazy(
    () => import("../pages/AgreementsSearch/AgreementsSearchPage")
  ),
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
  component: lazy(() => import("../pages/AgreementView/AgreementViewPage")),
  validateSearch: z.object({ tab: z.string().optional() }),
});

// Customer Routes
const customersRoute = rootRoute.createRoute({ path: "customers" });
const customersIndexRoute = customersRoute.createRoute({
  path: "/",
  component: lazy(() => import("../pages/CustomerSearch/CustomerSearchPage")),
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
const viewCustomerRoute = customersRoute.createRoute({
  path: "$customerId",
  component: lazy(() => import("../pages/CustomerView/CustomerViewPage")),
  validateSearch: z.object({ tab: z.string().optional() }),
});

// Reservation Routes
const reservationsRoute = rootRoute.createRoute({ path: "reservations" });
const reservationsIndexRoute = reservationsRoute.createRoute({
  path: "/",
  component: lazy(
    () => import("../pages/ReservationsSearch/ReservationsSearchPage")
  ),
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
  component: lazy(() => import("../pages/ReservationView/ReservationViewPage")),
  validateSearch: z.object({ tab: z.string().optional() }),
});

// Vehicle Routes
const vehiclesRoute = rootRoute.createRoute({ path: "vehicles" });
const vehiclesIndexRoute = vehiclesRoute.createRoute({
  path: "/",
  component: lazy(() => import("../pages/VehiclesSearch/VehiclesSearchPage")),
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
const viewVehicleRoute = vehiclesRoute.createRoute({
  path: "$vehicleId",
  component: lazy(() => import("../pages/VehicleView/VehicleViewPage")),
  validateSearch: z.object({ tab: z.string().optional() }),
});

export const routeConfig = rootRoute.addChildren([
  indexRoute,
  loggedOutRoute,
  agreementsRoute.addChildren([agreementsIndexRoute, viewAgreementRoute]),
  reservationsRoute.addChildren([reservationsIndexRoute, viewReservationRoute]),
  customersRoute.addChildren([customersIndexRoute, viewCustomerRoute]),
  vehiclesRoute.addChildren([vehiclesIndexRoute, viewVehicleRoute]),
]);
