import { createRouteConfig, Outlet, lazy } from "@tanstack/react-router";
import { z } from "zod";

import { OidcAuthProvider } from "./OidcAuthProvider";
import AppShellLayout from "../components/AppShellLayout";
import { getAuthToken } from "../utils/authLocal";
import { queryClient } from "../App";

import { AgreementFiltersSchema } from "../utils/schemas/agreement";
import { CustomerFiltersSchema } from "../utils/schemas/customer";
import { ReservationFiltersSchema } from "../utils/schemas/reservation";
import { VehicleFiltersSchema } from "../utils/schemas/vehicle";

import { fetchDashboardWidgetList } from "../api/dashboard";
import { fetchModuleColumnsModded } from "../hooks/network/module/useGetModuleColumns";

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

export const stylingRoute = rootRoute.createRoute({
  path: "styles",
  component: lazy(() => import("../pages/StylingArea/StylingAreaPage")),
});

export const loggedOutRoute = rootRoute.createRoute({
  path: "logged-out",
  component: lazy(() => import("../pages/LoggedOut/LoggedOutPage")),
});

export const indexRoute = rootRoute.createRoute({
  path: "/",
  loader: async () => {
    const auth = getAuthToken();
    if (auth) {
      queryClient.getQueryData(["dashboard", "widgets"]) ??
        (await queryClient.prefetchQuery({
          queryKey: ["dashboard", "widgets"],
          queryFn: () =>
            fetchDashboardWidgetList({
              clientId: auth.profile.navotar_clientid,
              userId: auth.profile.navotar_userid,
              accessToken: auth.access_token,
            }),
        }));
    }
    return {};
  },
  component: lazy(() => import("../pages/Index/IndexPage")),
});

// Agreement Routes
export const agreementsRoute = rootRoute.createRoute({ path: "agreements" });
export const agreementSearchRoute = agreementsRoute.createRoute({
  path: "/",
  loader: async () => {
    const auth = getAuthToken();
    if (auth) {
      queryClient.getQueryData(["agreements", "columns"]) ??
        (await queryClient.prefetchQuery({
          queryKey: ["agreements", "columns"],
          queryFn: () =>
            fetchModuleColumnsModded({
              clientId: auth.profile.navotar_clientid,
              userId: auth.profile.navotar_userid,
              accessToken: auth.access_token,
              module: "agreements",
            }),
        }));
    }
    return {};
  },
  component: lazy(
    () => import("../pages/AgreementsSearch/AgreementsSearchPage")
  ),
  validateSearch: (search) => {
    return z
      .object({
        page: z.number().min(1).default(1),
        size: z.number().min(1).default(10),
        filters: AgreementFiltersSchema.optional(),
      })
      .parse(search);
  },
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
  parseParams: (params) => ({
    agreementId: z.string().parse(params.agreementId),
  }),
  stringifyParams: (params) => ({ agreementId: `${params.agreementId}` }),
  validateSearch: (search) =>
    z
      .object({
        tab: z.string().optional(),
      })
      .parse(search),
});

// Customer Routes
export const customersRoute = rootRoute.createRoute({ path: "customers" });
export const customerSearchRoute = customersRoute.createRoute({
  path: "/",
  loader: async () => {
    const auth = getAuthToken();
    if (auth) {
      queryClient.getQueryData(["customers", "columns"]) ??
        (await queryClient.prefetchQuery({
          queryKey: ["customers", "columns"],
          queryFn: () =>
            fetchModuleColumnsModded({
              clientId: auth.profile.navotar_clientid,
              userId: auth.profile.navotar_userid,
              accessToken: auth.access_token,
              module: "customers",
            }),
        }));
    }
    return {};
  },
  component: lazy(() => import("../pages/CustomerSearch/CustomerSearchPage")),
  validateSearch: (search) =>
    z
      .object({
        page: z.number().min(1).default(1),
        size: z.number().min(1).default(10),
        filters: CustomerFiltersSchema.optional(),
      })
      .parse(search),
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
  parseParams: (params) => ({
    customerId: z.string().parse(params.customerId),
  }),
  stringifyParams: (params) => ({ customerId: `${params.customerId}` }),
  validateSearch: (search) =>
    z.object({ tab: z.string().optional() }).parse(search),
});

// Reservation Routes
export const reservationsRoute = rootRoute.createRoute({
  path: "reservations",
});
export const reservationsSearchRoute = reservationsRoute.createRoute({
  path: "/",
  loader: async () => {
    const auth = getAuthToken();
    if (auth) {
      queryClient.getQueryData(["reservations", "columns"]) ??
        (await queryClient.prefetchQuery({
          queryKey: ["reservations", "columns"],
          queryFn: () =>
            fetchModuleColumnsModded({
              clientId: auth.profile.navotar_clientid,
              userId: auth.profile.navotar_userid,
              accessToken: auth.access_token,
              module: "reservations",
            }),
        }));
    }
    return {};
  },
  component: lazy(
    () => import("../pages/ReservationsSearch/ReservationsSearchPage")
  ),
  validateSearch: (search) =>
    z
      .object({
        page: z.number().min(1).default(1),
        size: z.number().min(1).default(10),
        filters: ReservationFiltersSchema.optional(),
      })
      .parse(search),
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
  parseParams: (params) => ({
    reservationId: z.string().parse(params.reservationId),
  }),
  stringifyParams: (params) => ({ reservationId: `${params.reservationId}` }),
  validateSearch: (search) =>
    z.object({ tab: z.string().optional() }).parse(search),
});

// Vehicle Routes
export const vehiclesRoute = rootRoute.createRoute({ path: "vehicles" });
export const vehiclesSearchRoute = vehiclesRoute.createRoute({
  path: "/",
  loader: async () => {
    const auth = getAuthToken();
    if (auth) {
      queryClient.getQueryData(["vehicles", "columns"]) ??
        (await queryClient.prefetchQuery({
          queryKey: ["vehicles", "columns"],
          queryFn: () =>
            fetchModuleColumnsModded({
              clientId: auth.profile.navotar_clientid,
              userId: auth.profile.navotar_userid,
              accessToken: auth.access_token,
              module: "vehicles",
            }),
        }));
    }
    return {};
  },
  component: lazy(() => import("../pages/VehiclesSearch/VehiclesSearchPage")),
  validateSearch: (search) =>
    z
      .object({
        page: z.number().min(1).default(1),
        size: z.number().min(1).default(10),
        filters: VehicleFiltersSchema.optional(),
      })
      .parse(search),
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
  parseParams: (params) => ({
    vehicleId: z.string().parse(params.vehicleId),
  }),
  stringifyParams: (params) => ({ vehicleId: `${params.vehicleId}` }),
  validateSearch: (search) =>
    z.object({ tab: z.string().optional() }).parse(search),
});

export const routeConfig = rootRoute.addChildren([
  indexRoute,
  agreementsRoute.addChildren([agreementSearchRoute, viewAgreementRoute]),
  reservationsRoute.addChildren([
    reservationsSearchRoute,
    viewReservationRoute,
  ]),
  customersRoute.addChildren([customerSearchRoute, viewCustomerRoute]),
  vehiclesRoute.addChildren([vehiclesSearchRoute, viewVehicleRoute]),
  loggedOutRoute,
  stylingRoute,
]);
