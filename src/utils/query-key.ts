type Pagination = { page: number; pageSize: number };
type Filters = Record<string, any>;
type ReferenceId = string | number;

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
  // view by ID
  viewKey: "view-agreement",
  id: (id: ReferenceId) => [agreementQKeys.viewKey, id, "data"],
  summary: (id: ReferenceId) => [agreementQKeys.viewKey, id, "summary"],
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
};

export const vehicleQKeys = {
  // search
  rootKey: "vehicles",
  columns: () => [vehicleQKeys.rootKey, "columns"],
  search: ({
    filters,
    pagination,
  }: {
    pagination: Pagination;
    filters: Filters;
  }) => [vehicleQKeys.rootKey, pagination, filters],
  statuses: () => [vehicleQKeys.rootKey, "statuses"],
  // view by ID
  viewKey: "view-vehicle",
  id: (id: ReferenceId) => [vehicleQKeys.viewKey, id, "data"],
  summary: (id: ReferenceId) => [vehicleQKeys.viewKey, id, "summary"],
};

export const clientQKeys = {
  rootKey: "client",
  profile: () => [clientQKeys.rootKey, "profile"],
};

export const userQKeys = {
  rootKey: "users",
  me: () => [userQKeys.rootKey, "me"],
};

export const dashboardQKeys = {
  rootKey: "dashboard",
  widgets: () => [dashboardQKeys.rootKey, "widgets"],
  stats: () => [dashboardQKeys.rootKey, "statistics"],
  notices: () => [dashboardQKeys.rootKey, "notices"],
};

export const vehicleTypeQKeys = {
  rootKey: "vehicle-types",
  all: () => [vehicleTypeQKeys.rootKey, "all"],
};

export const locationQKeys = {
  rootKey: "locations",
  all: () => [locationQKeys.rootKey, "all"],
};
