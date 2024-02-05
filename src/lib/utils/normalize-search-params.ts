import type { TAgreementSearchQuery } from "@/lib/schemas/agreement";
import type { TCustomerSearchQuery } from "@/lib/schemas/customer";
import type { TReservationSearchQuery } from "@/lib/schemas/reservation";
import type { TVehicleSearchQuery } from "@/lib/schemas/vehicle";

import { STORAGE_DEFAULTS, STORAGE_KEYS } from "./constants";

export function normalizeAgreementListSearchParams(
  search: TAgreementSearchQuery
) {
  const { page, size, filters } = search;

  const rowCountStr = window.localStorage.getItem(STORAGE_KEYS.tableRowCount);
  const rowCount = parseInt(rowCountStr || STORAGE_DEFAULTS.tableRowCount, 10);

  const searchFilters = {
    AgreementStatusName: filters?.AgreementStatusName || undefined,
    Statuses: filters?.Statuses || [],
    IsSearchOverdues:
      typeof filters?.IsSearchOverdues !== "undefined"
        ? filters?.IsSearchOverdues
        : "false",
    StartDate: filters?.StartDate || undefined,
    EndDate: filters?.EndDate || undefined,
    SortBy: filters?.SortBy || "CreatedDate",
    SortDirection: filters?.SortDirection || "DESC",
    CustomerId: filters?.CustomerId || undefined,
    VehicleId: filters?.VehicleId || undefined,
    VehicleNo: filters?.VehicleNo || undefined,
    VehicleTypeId: filters?.VehicleTypeId || undefined,
    PickupLocationId: filters?.PickupLocationId || undefined,
    ReturnLocationId: filters?.ReturnLocationId || undefined,
    AgreementTypes: filters?.AgreementTypes || undefined,
    Keyword: filters?.Keyword || undefined,
    AgreementNumber: filters?.AgreementNumber || undefined,
  };

  const pageNumber = page || 1;
  const pageSize = size || rowCount;
  return { pageNumber, size: pageSize, searchFilters };
}

export function normalizeCustomerListSearchParams(
  search: TCustomerSearchQuery
) {
  const { page, size, filters } = search;

  const rowCountStr = window.localStorage.getItem(STORAGE_KEYS.tableRowCount);
  const rowCount = parseInt(rowCountStr || STORAGE_DEFAULTS.tableRowCount, 10);

  const searchFilters = {
    Active: typeof filters?.Active !== "undefined" ? filters?.Active : "true",
    SortDirection: filters?.SortDirection || "ASC",
    CustomerTypes: filters?.CustomerTypes || [],
    Keyword: filters?.Keyword || undefined,
    DateOfbirth: filters?.DateOfbirth || undefined,
    Phone: filters?.Phone || undefined,
  };

  const pageNumber = page || 1;
  const pageSize = size || rowCount;
  return { pageNumber, size: pageSize, searchFilters };
}

export function normalizeReservationListSearchParams(
  search: TReservationSearchQuery
) {
  const { page, size, filters } = search;

  const rowCountStr = window.localStorage.getItem(STORAGE_KEYS.tableRowCount);
  const rowCount = parseInt(rowCountStr || STORAGE_DEFAULTS.tableRowCount, 10);

  const searchFilters = {
    Statuses: filters?.Statuses || [],
    CreatedDateFrom: filters?.CreatedDateFrom || undefined,
    CreatedDateTo: filters?.CreatedDateTo || undefined,
    SortDirection: filters?.SortDirection || "ASC",
    CustomerId: filters?.CustomerId || undefined,
    VehicleId: filters?.VehicleId || undefined,
    VehicleNo: filters?.VehicleNo || undefined,
    VehicleTypeId: filters?.VehicleTypeId || undefined,
    CheckoutLocationId: filters?.CheckoutLocationId || undefined,
    CheckinLocationId: filters?.CheckinLocationId || undefined,
    ReservationTypes: filters?.ReservationTypes || undefined,
    Keyword: filters?.Keyword || undefined,
    ReservationNumber: filters?.ReservationNumber || undefined,
  };

  const pageNumber = page || 1;
  const pageSize = size || rowCount;
  return { pageNumber, size: pageSize, searchFilters };
}

export function normalizeVehicleListSearchParams(search: TVehicleSearchQuery) {
  const { page, size, filters } = search;

  const rowCountStr = window.localStorage.getItem(STORAGE_KEYS.tableRowCount);
  const rowCount = parseInt(rowCountStr || STORAGE_DEFAULTS.tableRowCount, 10);

  const searchFilters = {
    Active: typeof filters?.Active !== "undefined" ? filters?.Active : "true",
    SortDirection: filters?.SortDirection || "DESC",
    VehicleNo: filters?.VehicleNo || undefined,
    VehicleId: filters?.VehicleId || undefined,
    VehicleStatus: filters?.VehicleStatus || undefined,
    VehicleTypeId: filters?.VehicleTypeId || undefined,
    OwningLocationId: filters?.OwningLocationId || undefined,
    CurrentLocationId: filters?.CurrentLocationId || undefined,
    StartDate: undefined,
    EndDate: undefined,
  };

  const pageNumber = page || 1;
  const pageSize = size || rowCount;
  return { pageNumber, size: pageSize, searchFilters };
}
