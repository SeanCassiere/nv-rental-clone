import type { UseQueryOptions } from "@tanstack/react-query";

import { localDateToQueryYearMonthDay } from "@/utils/date";

import { apiClient } from "@/api";

type Pagination = { page: number; pageSize: number };
type Filters = Record<string, any>;
type ReferenceId = string | number;
type Auth = { userId: string; clientId: string };

function isEnabled(p: Auth) {
  return !!p.clientId && !!p.userId;
}

export const agreementQKeys = {
  // search
  rootKey: "agreements",
  columns: () => [agreementQKeys.rootKey, "columns"],
  search: ({
    filters,
    pagination,
  }: {
    pagination: Pagination;
    filters: Filters;
  }) => [agreementQKeys.rootKey, pagination, filters],
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
  notes: (id: ReferenceId) => [agreementQKeys.viewKey, id, "notes"],
  exchanges: (id: ReferenceId) => [agreementQKeys.viewKey, id, "exchanges"],
};

export const reservationQKeys = {
  // search
  rootKey: "reservations",
  columns: () => [reservationQKeys.rootKey, "columns"],
  search: ({
    filters,
    pagination,
  }: {
    pagination: Pagination;
    filters: Filters;
  }) => [reservationQKeys.rootKey, pagination, filters],
  statuses: () => [reservationQKeys.rootKey, "statuses"],
  types: () => [reservationQKeys.rootKey, "types"],
  // view by ID
  viewKey: "view-reservation",
  id: (id: ReferenceId) => [reservationQKeys.viewKey, id, "data"],
  summary: (id: ReferenceId) => [reservationQKeys.viewKey, id, "summary"],
  notes: (id: ReferenceId) => [reservationQKeys.viewKey, id, "notes"],
};

export const customerQKeys = {
  // search
  rootKey: "customers",
  columns: () => [customerQKeys.rootKey, "columns"],
  search: ({
    filters,
    pagination,
  }: {
    pagination: Pagination;
    filters: Filters;
  }) => [customerQKeys.rootKey, pagination, filters],
  types: () => [customerQKeys.rootKey, "types"],
  // view by ID
  viewKey: "view-customer",
  id: (id: ReferenceId) => [customerQKeys.viewKey, id, "data"],
  summary: (id: ReferenceId) => [customerQKeys.viewKey, id, "summary"],
  notes: (id: ReferenceId) => [customerQKeys.viewKey, id, "notes"],
};

export const fleetQKeys = {
  // search
  rootKey: "fleet",
  columns: () => [fleetQKeys.rootKey, "columns"],
  search: ({
    filters,
    pagination,
  }: {
    pagination: Pagination;
    filters: Filters;
  }) => [fleetQKeys.rootKey, pagination, filters],
  statuses: () => [fleetQKeys.rootKey, "statuses"],
  fuelLevels: () => [fleetQKeys.rootKey, "fuel-levels"],
  // view by ID
  viewKey: "view-fleet",
  id: (id: ReferenceId) => [fleetQKeys.viewKey, id, "data"],
  summary: (id: ReferenceId) => [fleetQKeys.viewKey, id, "summary"],
  notes: (id: ReferenceId) => [fleetQKeys.viewKey, id, "notes"],
};

export const clientQKeys = {
  rootKey: "client",
  profile: () => [clientQKeys.rootKey, "profile"],
  features: () => [clientQKeys.rootKey, "features"],
  screenSettings: () => [clientQKeys.rootKey, "screen-settings"],
};

export const userQKeys = {
  rootKey: "users",
  me: (p: Auth) => {
    return {
      queryKey: [userQKeys.rootKey, p.userId, "profile"],
      queryFn: () =>
        apiClient.user.getProfileByUserId({
          params: {
            userId: p.userId,
          },
          query: {
            clientId: p.clientId,
            userId: p.userId,
            currentUserId: p.userId,
          },
        }),
      enabled: !!p.clientId && !!p.userId,
      staleTime: 1000 * 60 * 1, // 1 minute
    } satisfies UseQueryOptions;
  },
  languages: (p: Auth) => {
    return {
      queryKey: [userQKeys.rootKey, "languages"],
      queryFn: () =>
        apiClient.user.getLanguages({
          query: {
            clientId: p.clientId,
            userId: p.userId,
          },
        }),
      enabled: !!p.clientId && !!p.userId,
      staleTime: 1000 * 60 * 1, // 1 minute
    } satisfies UseQueryOptions;
  },
  permissions: (p: Auth) => {
    return {
      queryKey: [userQKeys.rootKey, p.userId, "permissions"],
      queryFn: () =>
        apiClient.user.getPermissionForUserId({
          params: { userId: p.userId },
          query: {
            clientId: p.clientId,
          },
        }),
      enabled: !!p.clientId && !!p.userId,
      staleTime: 1000 * 60 * 5, // 5 minutes
    } satisfies UseQueryOptions;
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
    `locations-[${locations.join(",")}]`,
    localDateToQueryYearMonthDay(date),
  ],
  messages: () => [dashboardQKeys.rootKey, "messages"],
  salesStatus: ({ locations }: { locations: string[] }) => [
    dashboardQKeys.rootKey,
    "sales-status",
    `locations-[${locations.join(",")}]`,
  ],
  vehicleStatusCounts: ({
    locationId,
    vehicleType,
  }: {
    locationId: string[];
    vehicleType: string | number;
  }) => [
    dashboardQKeys.rootKey,
    "vehicle-status-counts",
    `location-[${locationId.join(",")}]`,
    `vehicle-type-${vehicleType}`,
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
  all: (p: Auth) => {
    return {
      queryKey: [roleQKeys.rootKey, "all"],
      queryFn: () =>
        apiClient.role.getList({
          query: { clientId: p.clientId, userId: p.userId },
        }),
      staleTime: 1000 * 60 * 1, // 1 minute,
      enabled: isEnabled(p),
    } satisfies UseQueryOptions;
  },
  getById: (p: Auth & { roleId: string }) => {
    return {
      queryKey: [roleQKeys.rootKey, p.roleId],
      queryFn: () =>
        apiClient.role.getById({
          params: { roleId: p.roleId },
          query: { clientId: p.clientId, userId: p.userId },
        }),
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled: isEnabled(p),
    } satisfies UseQueryOptions;
  },
  permissionsList: (p: Auth) => ({
    queryKey: [roleQKeys.rootKey, "permissions"],
    queryFn: () =>
      apiClient.role.getPermissions({
        query: { clientId: p.clientId, userId: p.userId },
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: isEnabled(p),
  }),
};
