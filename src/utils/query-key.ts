import { queryOptions } from "@tanstack/react-query";

import { localDateToQueryYearMonthDay } from "@/utils/date";

import { apiClient } from "@/api";

import { sortObjectKeys } from "./sort";

type Pagination = { page: number; pageSize: number };
type Filters = Record<string, any>;
type ReferenceId = string | number;
type Auth = { auth: { userId: string; clientId: string } };

function rootKey({ auth }: Auth) {
  return `${auth.clientId}:${auth.userId}`;
}

function isEnabled({ auth }: Auth) {
  return !!auth.clientId && !!auth.userId;
}

export const agreementQKeys = {
  // search
  rootKey: "agreements",
  columns: () => [agreementQKeys.rootKey, "columns"],
  search: (opts: { pagination: Pagination; filters: Filters }) => [
    agreementQKeys.rootKey,
    "list",
    sortObjectKeys(opts.pagination),
    sortObjectKeys(opts.filters),
  ],
  statuses: () => [agreementQKeys.rootKey, "statuses"],
  types: () => [agreementQKeys.rootKey, "types"],
  generateNumber: (type: string) => [
    agreementQKeys.rootKey,
    "generate-number",
    type,
  ],
  // view by ID
  viewKey: "view-agreement",
  id: (id: ReferenceId) => [agreementQKeys.viewKey, id, "data"],
  summary: (id: ReferenceId) => [agreementQKeys.viewKey, id, "summary"],
  viewNotes: (
    opts: {
      agreementId: ReferenceId;
    } & Auth
  ) =>
    queryOptions({
      queryKey: [
        rootKey(opts),
        agreementQKeys.viewKey,
        opts.agreementId,
        "notes",
      ],
      queryFn: () =>
        apiClient.note.getListForRefId({
          params: {
            referenceType: "agreement",
            referenceId: String(opts.agreementId),
          },
          query: {
            clientId: opts.auth.clientId,
          },
        }),
      enabled: isEnabled(opts),
    }),
  viewExchanges: (
    opts: {
      agreementId: ReferenceId;
    } & Auth
  ) =>
    queryOptions({
      queryKey: [
        rootKey(opts),
        agreementQKeys.viewKey,
        opts.agreementId,
        "exchanges",
      ],
      queryFn: () =>
        apiClient.vehicleExchange.getList({
          query: {
            clientId: opts.auth.clientId,
            userId: opts.auth.userId,
            agreementId: `${opts.agreementId}`,
          },
        }),
      enabled: isEnabled(opts),
    }),
};

export const reservationQKeys = {
  // search
  rootKey: "reservations",
  columns: () => [reservationQKeys.rootKey, "columns"],
  search: (opts: { pagination: Pagination; filters: Filters }) => [
    reservationQKeys.rootKey,
    "list",
    sortObjectKeys(opts.pagination),
    sortObjectKeys(opts.filters),
  ],
  statuses: () => [reservationQKeys.rootKey, "statuses"],
  types: () => [reservationQKeys.rootKey, "types"],
  // view by ID
  viewKey: "view-reservation",
  id: (id: ReferenceId) => [reservationQKeys.viewKey, id, "data"],
  summary: (id: ReferenceId) => [reservationQKeys.viewKey, id, "summary"],
  viewNotes: (
    opts: {
      reservationId: ReferenceId;
    } & Auth
  ) =>
    queryOptions({
      queryKey: [
        rootKey(opts),
        reservationQKeys.viewKey,
        opts.reservationId,
        "notes",
      ],
      queryFn: () =>
        apiClient.note.getListForRefId({
          params: {
            referenceType: "reservation",
            referenceId: String(opts.reservationId),
          },
          query: {
            clientId: opts.auth.clientId,
          },
        }),
      enabled: isEnabled(opts),
    }),
};

export const customerQKeys = {
  // search
  rootKey: "customers",
  columns: () => [customerQKeys.rootKey, "columns"],
  search: (opts: { pagination: Pagination; filters: Filters }) => [
    customerQKeys.rootKey,
    "list",
    sortObjectKeys(opts.pagination),
    sortObjectKeys(opts.filters),
  ],
  types: () => [customerQKeys.rootKey, "types"],
  // view by ID
  viewKey: "view-customer",
  id: (id: ReferenceId) => [customerQKeys.viewKey, id, "data"],
  summary: (id: ReferenceId) => [customerQKeys.viewKey, id, "summary"],
  viewNotes: (opts: { customerId: ReferenceId } & Auth) =>
    queryOptions({
      queryKey: [
        rootKey(opts),
        customerQKeys.viewKey,
        opts.customerId,
        "notes",
      ],
      queryFn: () =>
        apiClient.note.getListForRefId({
          params: {
            referenceType: "customer",
            referenceId: String(opts.customerId),
          },
          query: {
            clientId: opts.auth.clientId,
          },
        }),
      enabled: isEnabled(opts),
    }),
};

export const fleetQKeys = {
  // search
  rootKey: "fleet",
  columns: () => [fleetQKeys.rootKey, "columns"],
  search: (opts: { pagination: Pagination; filters: Filters }) => [
    fleetQKeys.rootKey,
    "list",
    sortObjectKeys(opts.pagination),
    sortObjectKeys(opts.filters),
  ],
  statuses: () => [fleetQKeys.rootKey, "statuses"],
  fuelLevels: () => [fleetQKeys.rootKey, "fuel-levels"],
  // view by ID
  viewKey: "view-fleet",
  id: (id: ReferenceId) => [fleetQKeys.viewKey, id, "data"],
  summary: (id: ReferenceId) => [fleetQKeys.viewKey, id, "summary"],
  viewNotes: (opts: { fleetId: ReferenceId } & Auth) =>
    queryOptions({
      queryKey: [rootKey(opts), fleetQKeys.viewKey, opts.fleetId, "notes"],
      queryFn: () =>
        apiClient.note.getListForRefId({
          params: {
            referenceType: "vehicle",
            referenceId: String(opts.fleetId),
          },
          query: {
            clientId: opts.auth.clientId,
          },
        }),
      enabled: isEnabled(opts),
    }),
};

export const clientQKeys = {
  rootKey: "client",
  profile: () => [clientQKeys.rootKey, "profile"],
  features: () => [clientQKeys.rootKey, "features"],
  screenSettings: () => [clientQKeys.rootKey, "screen-settings"],
};

export const userQKeys = {
  rootKey: "users",
  me: (opts: Auth) => {
    return queryOptions({
      queryKey: [rootKey(opts), userQKeys.rootKey, opts.auth.userId, "profile"],
      queryFn: () =>
        apiClient.user.getProfileByUserId({
          params: {
            userId: opts.auth.userId,
          },
          query: {
            clientId: opts.auth.clientId,
            userId: opts.auth.userId,
            currentUserId: opts.auth.userId,
          },
        }),
      enabled: !!opts.auth.clientId && !!opts.auth.userId,
      staleTime: 1000 * 60 * 1, // 1 minute
    });
  },
  languages: (opts: Auth) => {
    return queryOptions({
      queryKey: [rootKey(opts), userQKeys.rootKey, "languages"],
      queryFn: () =>
        apiClient.user.getLanguages({
          query: {
            clientId: opts.auth.clientId,
            userId: opts.auth.userId,
          },
        }),
      enabled: !!opts.auth.clientId && !!opts.auth.userId,
      staleTime: 1000 * 60 * 1, // 1 minute
    });
  },
  permissions: (opts: Auth) => {
    return queryOptions({
      queryKey: [
        rootKey(opts),
        userQKeys.rootKey,
        opts.auth.userId,
        "permissions",
      ],
      queryFn: () =>
        apiClient.user.getPermissionForUserId({
          params: { userId: opts.auth.userId },
          query: {
            clientId: opts.auth.clientId,
          },
        }),
      enabled: !!opts.auth.clientId && !!opts.auth.userId,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  },
  profile: (userId: string) => [userQKeys.rootKey, userId, "profile"],
  updatingProfile: (userId: string) => [
    userQKeys.rootKey,
    userId,
    "updating-profile",
  ],
  userConfigurations: () => [userQKeys.rootKey, "user-configurations"],
  activeUsersCount: () => [userQKeys.rootKey, "active-users-count"],
  maximumUsersCount: () => [userQKeys.rootKey, "maximum-users-count"],
};

export const dashboardQKeys = {
  rootKey: "dashboard",
  widgets: () => [dashboardQKeys.rootKey, "widgets"],
  stats: (date: Date, locations: string[]) => [
    dashboardQKeys.rootKey,
    "statistics",
    `locations-[${locations.sort().join(",")}]`,
    localDateToQueryYearMonthDay(date),
  ],
  messages: () => [dashboardQKeys.rootKey, "messages"],
  salesStatus: (opts: { locations: string[] }) => [
    dashboardQKeys.rootKey,
    "sales-status",
    `locations-[${opts.locations.sort().join(",")}]`,
  ],
  vehicleStatusCounts: (opts: {
    locationId: string[];
    vehicleType: string | number;
  }) => [
    dashboardQKeys.rootKey,
    "vehicle-status-counts",
    `location-[${opts.locationId.sort().join(",")}]`,
    `vehicle-type-${opts.vehicleType}`,
  ],
};

export const vehicleTypeQKeys = {
  rootKey: "vehicle-types",
  all: (options?: any) => [
    vehicleTypeQKeys.rootKey,
    "all",
    options ? options : undefined,
  ],
  lookup: () => [vehicleTypeQKeys.rootKey, "lookup"],
};

export const locationQKeys = {
  rootKey: "locations",
  all: (filters: { withActive: boolean }) => [
    locationQKeys.rootKey,
    "all",
    filters,
  ],
};

export const roleQKeys = {
  rootKey: "roles",
  all: (opts: Auth) => {
    return queryOptions({
      queryKey: [rootKey(opts), roleQKeys.rootKey, "all"],
      queryFn: () =>
        apiClient.role.getList({
          query: { clientId: opts.auth.clientId, userId: opts.auth.userId },
        }),
      staleTime: 1000 * 60 * 1, // 1 minute,
      enabled: isEnabled(opts),
    });
  },
  getById: (opts: { roleId: string } & Auth) => {
    return queryOptions({
      queryKey: [rootKey(opts), roleQKeys.rootKey, opts.roleId],
      queryFn: () =>
        apiClient.role.getById({
          params: { roleId: opts.roleId },
          query: { clientId: opts.auth.clientId, userId: opts.auth.userId },
        }),
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled: isEnabled(opts),
    });
  },
  permissionsList: (opts: Auth) => {
    return queryOptions({
      queryKey: [rootKey(opts), roleQKeys.rootKey, "permissions"],
      queryFn: () =>
        apiClient.role.getPermissions({
          query: { clientId: opts.auth.clientId, userId: opts.auth.userId },
        }),
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled: isEnabled(opts),
    });
  },
};

export const reportQKeys = {
  getReports: (opts: Auth) =>
    queryOptions({
      queryKey: [rootKey(opts), "reports", "list"],
      queryFn: () =>
        apiClient.report.getList({
          query: {
            clientId: opts.auth.clientId,
            userId: opts.auth.userId,
          },
        }),
      staleTime: 1000 * 60 * 2, // 2 minutes
      enabled: isEnabled(opts),
    }),
  getDetailsById: (opts: { reportId: string } & Auth) =>
    queryOptions({
      queryKey: [rootKey(opts), "reports", opts.reportId],
      queryFn: () =>
        apiClient.report.getById({
          params: { reportId: opts.reportId },
          query: opts.auth,
        }),
      staleTime: 1000 * 60 * 1, // 1 minutes
      enabled: isEnabled(opts),
    }),
};
