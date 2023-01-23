import { type TAgreementSearchQuery } from "./schemas/agreement";
import { type TCustomerSearchQuery } from "./schemas/customer";
import { type TReservationSearchQuery } from "./schemas/reservation";
import { type TVehicleSearchQuery } from "./schemas/vehicle";

export function normalizeAgreementListSearchParams(
  search: TAgreementSearchQuery
) {
  const { page, size, filters } = search;

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
  return { pageNumber, size: pageSize, searchFilters };
}

export function normalizeCustomerListSearchParams(
  search: TCustomerSearchQuery
) {
  const { page, size, filters } = search;

  const searchFilters = {
    Active: typeof filters?.Active !== "undefined" ? filters?.Active : true,
    SortDirection: filters?.SortDirection || "ASC",
  };

  const pageNumber = page || 1;
  const pageSize = size || 10;
  return { pageNumber, size: pageSize, searchFilters };
}

export function normalizeReservationListSearchParams(
  search: TReservationSearchQuery
) {
  const { page, size, filters } = search;

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
  return { pageNumber, size: pageSize, searchFilters };
}

export function normalizeVehicleListSearchParams(search: TVehicleSearchQuery) {
  const { page, size, filters } = search;

  const searchFilters = {
    Active: typeof filters?.Active !== "undefined" ? filters?.Active : true,
    SortDirection: filters?.SortDirection || "DESC",
    VehicleNo: filters?.VehicleNo || undefined,
    VehicleId: filters?.VehicleId || undefined,
    VehicleStatus: filters?.VehicleStatus || undefined,
  };

  const pageNumber = page || 1;
  const pageSize = size || 10;
  return { pageNumber, size: pageSize, searchFilters };
}
