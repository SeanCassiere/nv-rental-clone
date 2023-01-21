import { createRouteConfig, Outlet, lazy } from "@tanstack/react-router";
import { z } from "zod";

import AppShellLayout from "../components/AppShellLayout";
import { getAuthToken } from "../utils/authLocal";
import { queryClient } from "../App";

import { AgreementFiltersSchema } from "../utils/schemas/agreement";
import { CustomerFiltersSchema } from "../utils/schemas/customer";
import { ReservationFiltersSchema } from "../utils/schemas/reservation";
import { VehicleFiltersSchema } from "../utils/schemas/vehicle";
import {
  agreementQKeys,
  reservationQKeys,
  customerQKeys,
  vehicleQKeys,
} from "../utils/query-key";

import { fetchDashboardWidgetList } from "../api/dashboard";
import { fetchModuleColumnsModded } from "../hooks/network/module/useGetModuleColumns";
import { fetchAgreementsListModded } from "../hooks/network/agreement/useGetAgreementsList";
import { fetchReservationsListModded } from "../hooks/network/reservation/useGetReservationsList";
import { fetchCustomersListModded } from "../hooks/network/customer/useGetCustomersList";
import { fetchVehiclesListModded } from "../hooks/network/vehicle/useGetVehiclesList";
import {
  fetchCustomerSummaryAmounts,
  fetchRentalRateSummaryAmounts,
  fetchVehicleSummaryAmounts,
} from "../api/summary";

export const rootRoute = createRouteConfig({
  component: () => {
    return (
      <AppShellLayout>
        <Outlet />
      </AppShellLayout>
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
      ...search,
      page: search.page || 1,
      size: search.size || 10,
    }),
  ],
  loader: async ({ search: { page, size, filters } }) => {
    const auth = getAuthToken();

    const searchFilters = {
      AgreementStatusName: filters?.AgreementStatusName || undefined,
      Statuses: filters?.Statuses || [],
      IsSearchOverdues:
        typeof filters?.IsSearchOverdues !== "undefined"
          ? filters?.IsSearchOverdues
          : false,
      StartDate: filters?.StartDate || undefined,
      EndDate: filters?.EndDate || undefined,
      SortBy: filters?.SortBy || "CreatedDate",
      SortDirection: filters?.SortDirection || "DESC",
      CustomerId: filters?.CustomerId || undefined,
      VehicleId: filters?.VehicleId || undefined,
      VehicleNo: filters?.VehicleNo || undefined,
    };

    const pageNumber = page || 1;
    const pageSize = size || 10;

    if (auth) {
      const promises = [];

      // get columns
      const columnsKey = agreementQKeys.columns();
      if (!queryClient.getQueryData(columnsKey)) {
        promises.push(
          queryClient.prefetchQuery({
            queryKey: columnsKey,
            queryFn: () =>
              fetchModuleColumnsModded({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                module: "agreements",
              }),
          })
        );
      }

      // get list
      const searchKey = agreementQKeys.search({
        pagination: { page: pageNumber, pageSize: pageSize },
        filters: searchFilters,
      });
      if (!queryClient.getQueryData(searchKey)) {
        promises.push(
          queryClient.prefetchQuery({
            queryKey: searchKey,
            queryFn: () =>
              fetchAgreementsListModded({
                page: pageNumber,
                pageSize: pageSize,
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                currentDate: new Date(),
                filters: searchFilters,
              }),
          })
        );
      }

      await Promise.all(promises);
    }
    return { searchFilters, pageNumber, size: pageSize };
  },
});
export const viewAgreementRoute = agreementsRoute.createRoute({
  path: "$agreementId",
  validateSearch: (search) =>
    z
      .object({
        tab: z.string().optional(),
      })
      .parse(search),
  preSearchFilters: [() => ({ tab: "summary" })],
  loader: async ({ params: { agreementId } }) => {
    const auth = getAuthToken();

    if (auth) {
      const promises = [];
      // get summary
      const summaryKey = agreementQKeys.summary(agreementId);
      if (!queryClient.getQueryData(summaryKey)) {
        promises.push(
          queryClient.prefetchQuery({
            queryKey: summaryKey,
            queryFn: () =>
              fetchRentalRateSummaryAmounts({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                module: "agreements",
                referenceId: agreementId,
              }),
          })
        );
      }

      await Promise.all(promises);
    }
    return {};
  },
  component: lazy(() => import("../pages/AgreementView/AgreementViewPage")),
  parseParams: (params) => ({
    agreementId: z.string().parse(params.agreementId),
  }),
  stringifyParams: (params) => ({ agreementId: `${params.agreementId}` }),
});

// Customer Routes
export const customersRoute = rootRoute.createRoute({ path: "customers" });
export const customerSearchRoute = customersRoute.createRoute({
  path: "/",
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
      ...search,
      page: search.page || 1,
      size: search.size || 10,
    }),
  ],
  loader: async ({ search: { page, size, filters } }) => {
    const auth = getAuthToken();

    const searchFilters = {
      Active: typeof filters?.Active !== "undefined" ? filters?.Active : true,
      SortDirection: filters?.SortDirection || "ASC",
    };

    const pageNumber = page || 1;
    const pageSize = size || 10;

    if (auth) {
      const promises = [];

      // get columns
      const columnsKey = customerQKeys.columns();
      if (!queryClient.getQueryData(columnsKey)) {
        promises.push(
          queryClient.prefetchQuery({
            queryKey: columnsKey,
            queryFn: () =>
              fetchModuleColumnsModded({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                module: "customers",
              }),
          })
        );
      }

      // get search
      const searchKey = customerQKeys.search({
        pagination: { page: pageNumber, pageSize: pageSize },
        filters: searchFilters,
      });
      if (!queryClient.getQueryData(searchKey)) {
        promises.push(
          queryClient.prefetchQuery({
            queryKey: searchKey,
            queryFn: () =>
              fetchCustomersListModded({
                page: pageNumber,
                pageSize: pageSize,
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                filters: searchFilters,
              }),
          })
        );
      }

      await Promise.all(promises);
    }
    return { searchFilters, pageNumber, size: pageSize };
  },
});
export const viewCustomerRoute = customersRoute.createRoute({
  path: "$customerId",
  component: lazy(() => import("../pages/CustomerView/CustomerViewPage")),
  validateSearch: (search) =>
    z.object({ tab: z.string().optional() }).parse(search),
  preSearchFilters: [() => ({ tab: "summary" })],
  loader: async ({ params: { customerId } }) => {
    const auth = getAuthToken();

    if (auth) {
      const promises = [];
      // get summary
      const summaryKey = customerQKeys.summary(customerId);
      if (!queryClient.getQueryData(summaryKey)) {
        promises.push(
          queryClient.prefetchQuery({
            queryKey: summaryKey,
            queryFn: () =>
              fetchCustomerSummaryAmounts({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                customerId,
              }),
          })
        );
      }

      await Promise.all(promises);
    }
    return {};
  },
  parseParams: (params) => ({
    customerId: z.string().parse(params.customerId),
  }),
  stringifyParams: (params) => ({ customerId: `${params.customerId}` }),
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
      ...search,
      page: search.page || 1,
      size: search.size || 10,
    }),
  ],
  loader: async ({ search: { page, size, filters } }) => {
    const auth = getAuthToken();

    const searchFilters = {
      Statuses: filters?.Statuses || [],
      CreatedDateFrom: filters?.CreatedDateFrom || undefined,
      CreatedDateTo: filters?.CreatedDateTo || undefined,
      SortDirection: filters?.SortDirection || "ASC",
      CustomerId: filters?.CustomerId || undefined,
      VehicleId: filters?.VehicleId || undefined,
      VehicleNo: filters?.VehicleNo || undefined,
    };

    const pageNumber = page || 1;
    const pageSize = size || 10;

    if (auth) {
      const promises = [];

      // get columns
      const columnsKey = reservationQKeys.columns();
      if (!queryClient.getQueryData(columnsKey)) {
        promises.push(
          queryClient.prefetchQuery({
            queryKey: columnsKey,
            queryFn: () =>
              fetchModuleColumnsModded({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                module: "reservations",
              }),
          })
        );
      }

      // get search
      const searchKey = reservationQKeys.search({
        pagination: { page: pageNumber, pageSize: pageSize },
        filters: searchFilters,
      });
      if (!queryClient.getQueryData(searchKey)) {
        promises.push(
          queryClient.prefetchQuery({
            queryKey: searchKey,
            queryFn: () =>
              fetchReservationsListModded({
                page: pageNumber,
                pageSize: pageSize,
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                filters: searchFilters,
                clientDate: new Date(),
              }),
          })
        );
      }
      await Promise.all(promises);
    }
    return { searchFilters, pageNumber, size: pageSize };
  },
});
export const viewReservationRoute = reservationsRoute.createRoute({
  path: "$reservationId",
  validateSearch: (search) =>
    z.object({ tab: z.string().optional() }).parse(search),
  preSearchFilters: [() => ({ tab: "summary" })],
  loader: async ({ params: { reservationId } }) => {
    const auth = getAuthToken();

    if (auth) {
      const promises = [];
      // get summary
      const summaryKey = reservationQKeys.summary(reservationId);
      if (!queryClient.getQueryData(summaryKey)) {
        promises.push(
          queryClient.prefetchQuery({
            queryKey: summaryKey,
            queryFn: () =>
              fetchRentalRateSummaryAmounts({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                module: "reservations",
                referenceId: reservationId,
              }),
          })
        );
      }

      await Promise.all(promises);
    }
    return {};
  },
  component: lazy(() => import("../pages/ReservationView/ReservationViewPage")),
  parseParams: (params) => ({
    reservationId: z.string().parse(params.reservationId),
  }),
  stringifyParams: (params) => ({ reservationId: `${params.reservationId}` }),
});

// Vehicle Routes
export const vehiclesRoute = rootRoute.createRoute({ path: "vehicles" });
export const vehiclesSearchRoute = vehiclesRoute.createRoute({
  path: "/",
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
      ...search,
      page: search.page || 1,
      size: search.size || 10,
    }),
  ],
  loader: async ({ search: { page, size, filters } }) => {
    const auth = getAuthToken();

    const searchFilters = {
      Active: typeof filters?.Active !== "undefined" ? filters?.Active : true,
      SortDirection: filters?.SortDirection || "DESC",
      VehicleNo: filters?.VehicleNo || undefined,
      VehicleId: filters?.VehicleId || undefined,
      VehicleStatus: filters?.VehicleStatus || undefined,
    };

    const pageNumber = page || 1;
    const pageSize = size || 10;

    if (auth) {
      const promises = [];

      // get columns
      const columnsKey = vehicleQKeys.columns();
      if (!queryClient.getQueryData(columnsKey)) {
        promises.push(
          queryClient.prefetchQuery({
            queryKey: columnsKey,
            queryFn: () =>
              fetchModuleColumnsModded({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                module: "vehicles",
              }),
          })
        );
      }

      // get search
      const searchKey = vehicleQKeys.search({
        pagination: { page: pageNumber, pageSize: pageSize },
        filters: searchFilters,
      });
      if (!queryClient.getQueryData(searchKey)) {
        promises.push(
          queryClient.prefetchQuery({
            queryKey: searchKey,
            queryFn: () =>
              fetchVehiclesListModded({
                page: pageNumber,
                pageSize: pageSize,
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                filters: searchFilters,
              }),
          })
        );
      }

      await Promise.all(promises);
    }
    return { searchFilters, pageNumber, size: pageSize };
  },
});
export const viewVehicleRoute = vehiclesRoute.createRoute({
  path: "$vehicleId",
  validateSearch: (search) =>
    z.object({ tab: z.string().optional() }).parse(search),
  preSearchFilters: [() => ({ tab: "summary" })],
  loader: async ({ params: { vehicleId } }) => {
    const auth = getAuthToken();

    if (auth) {
      const promises = [];
      // get summary
      const summaryKey = vehicleQKeys.summary(vehicleId);
      if (!queryClient.getQueryData(summaryKey)) {
        promises.push(
          queryClient.prefetchQuery({
            queryKey: summaryKey,
            queryFn: () =>
              fetchVehicleSummaryAmounts({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                vehicleId,
                clientDate: new Date(),
              }),
          })
        );
      }

      await Promise.all(promises);
    }
    return {};
  },
  component: lazy(() => import("../pages/VehicleView/VehicleViewPage")),
  parseParams: (params) => ({
    vehicleId: z.string().parse(params.vehicleId),
  }),
  stringifyParams: (params) => ({ vehicleId: `${params.vehicleId}` }),
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
