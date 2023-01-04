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

export const indexRoute = rootRoute.createRoute({
  path: "/",
  component: lazy(() => import("../pages/Index/IndexPage")),
});

export const stylingRoute = rootRoute.createRoute({
  path: "/styles",
  component: lazy(() => import("../pages/StylingArea/StylingAreaPage")),
});

export const loggedOutRoute = rootRoute.createRoute({
  path: "/logged-out",
  component: lazy(() => import("../pages/LoggedOut/LoggedOutPage")),
});

// Agreement Routes
export const agreementsRoute = rootRoute.createRoute({ path: "agreements" });
export const agreementSearchRoute = agreementsRoute.createRoute({
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
export const viewAgreementRoute = agreementsRoute.createRoute({
  path: "$agreementId",
  component: lazy(() => import("../pages/AgreementView/AgreementViewPage")),
  validateSearch: z.object({ tab: z.string().optional() }),
});

// Customer Routes
export const customersRoute = rootRoute.createRoute({ path: "customers" });
export const customerSearchRoute = customersRoute.createRoute({
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
export const viewCustomerRoute = customersRoute.createRoute({
  path: "$customerId",
  component: lazy(() => import("../pages/CustomerView/CustomerViewPage")),
  validateSearch: z.object({ tab: z.string().optional() }),
});

// Reservation Routes
export const reservationsRoute = rootRoute.createRoute({
  path: "reservations",
});
export const reservationsSearchRoute = reservationsRoute.createRoute({
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
export const viewReservationRoute = reservationsRoute.createRoute({
  path: "$reservationId",
  component: lazy(() => import("../pages/ReservationView/ReservationViewPage")),
  validateSearch: z.object({ tab: z.string().optional() }),
});

// Vehicle Routes
export const vehiclesRoute = rootRoute.createRoute({ path: "vehicles" });
export const vehiclesSearchRoute = vehiclesRoute.createRoute({
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
export const viewVehicleRoute = vehiclesRoute.createRoute({
  path: "$vehicleId",
  component: lazy(() => import("../pages/VehicleView/VehicleViewPage")),
  validateSearch: z.object({ tab: z.string().optional() }),
});

export const routeConfig = rootRoute.addChildren([
  indexRoute,
  loggedOutRoute,
  stylingRoute,
  agreementsRoute.addChildren([agreementSearchRoute, viewAgreementRoute]),
  reservationsRoute.addChildren([
    reservationsSearchRoute,
    viewReservationRoute,
  ]),
  customersRoute.addChildren([customerSearchRoute, viewCustomerRoute]),
  vehiclesRoute.addChildren([vehiclesSearchRoute, viewVehicleRoute]),
]);
