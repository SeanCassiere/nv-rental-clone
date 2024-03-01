import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";

import type { TReportDetail } from "@/lib/schemas/report";
import { fetchAgreementStatusesOptions } from "@/lib/query/agreement";
import { fetchLocationsListOptions } from "@/lib/query/location";
import { fetchReservationStatusesOptions } from "@/lib/query/reservation";
import {
  fetchVehiclesStatusesOptions,
  fetchVehiclesTypesOptions,
} from "@/lib/query/vehicle";

import { getAuthFromAuthHook } from "@/lib/utils/auth";
import { insertSpacesBeforeCaps } from "@/lib/utils/random";

import type { ReportFilterOption } from "@/lib/types/report";

type CriteriaList = TReportDetail["searchCriteria"];

function confirmRequirement(criteria: CriteriaList, lookup: string) {
  return criteria.some((c) => c.name.toLowerCase() === lookup.toLowerCase());
}

export function useReportLookupLists(report: TReportDetail) {
  const { t } = useTranslation();
  const auth = useAuth();
  const authParams = getAuthFromAuthHook(auth);

  // 1. BEGIN - lookup for locations
  const findLocations = confirmRequirement(report.searchCriteria, "LocationId");
  const locationsQuery = useQuery(
    fetchLocationsListOptions({
      auth: authParams,
      filters: { withActive: true },
      enabled: findLocations,
    })
  );
  const locationsList =
    locationsQuery.data?.status === 200 ? locationsQuery.data.body : [];
  const locationOptions: ReportFilterOption[] = locationsList.map((loc) => ({
    value: `${loc.locationId}`,
    display: `${loc.locationName}`,
  }));
  // END - lookup for locations

  // 2. BEGIN -  lookup for agreement statuses
  const findAgreementStatuses = confirmRequirement(
    report.searchCriteria,
    "AgreementStatus"
  );
  const agreementStatusesQuery = useQuery(
    fetchAgreementStatusesOptions({
      auth: authParams,
      enabled: findAgreementStatuses,
    })
  );
  const agreementStatusesList = agreementStatusesQuery.data ?? [];
  const agreementStatusOptions: ReportFilterOption[] =
    agreementStatusesList.map((status) => ({
      value: `${status.id}`,
      display: insertSpacesBeforeCaps(`${status.name}`),
    }));
  // END - lookup for agreement statuses

  // 3. BEGIN -  lookup for reservation statuses
  const findReservationStatuses = confirmRequirement(
    report.searchCriteria,
    "ReservationStatus"
  );
  const reservationStatusesQuery = useQuery(
    fetchReservationStatusesOptions({
      auth: authParams,
      enabled: findReservationStatuses,
    })
  );
  const reservationStatusesList = reservationStatusesQuery.data ?? [];
  const reservationStatusOptions: ReportFilterOption[] =
    reservationStatusesList.map((status) => ({
      value: `${status.id}`,
      display: insertSpacesBeforeCaps(`${status.name}`),
    }));
  // END - lookup for reservation statuses

  // 4. BEGIN - lookup for vehicle types
  const findVehicleTypes = confirmRequirement(
    report.searchCriteria,
    "VehicleTypeId"
  );
  const vehicleTypesQuery = useQuery(
    fetchVehiclesTypesOptions({
      auth: authParams,
      enabled: findVehicleTypes,
    })
  );
  const vehicleTypesList = vehicleTypesQuery.data ?? [];
  const vehicleTypeOptions: ReportFilterOption[] = vehicleTypesList.map(
    (type) => ({
      value: `${type.id}`,
      display: `${type.value}`,
    })
  );
  // END - lookup for vehicle types

  // 5. BEGIN -  lookup for vehicle statuses
  const findVehicleStatuses = confirmRequirement(
    report.searchCriteria,
    "VehicleStatus"
  );
  const vehicleStatusesQuery = useQuery(
    fetchVehiclesStatusesOptions({
      auth: authParams,
      enabled: findVehicleStatuses,
    })
  );
  const vehicleStatusesList = vehicleStatusesQuery.data ?? [];
  const vehicleStatusOptions: ReportFilterOption[] = vehicleStatusesList.map(
    (status) => ({
      value: `${status.id}`,
      display: insertSpacesBeforeCaps(`${status.name}`),
    })
  );
  // END - lookup for vehicle statuses

  // 6. BEGIN - lookup for active, inactive
  const activeInactiveOptions: ReportFilterOption[] = [
    { value: "1", display: "Active" },
    { value: "0", display: "Inactive" },
  ];
  // END - lookup for active, inactive

  // dynamically get list of options
  const getList = (name: string): ReportFilterOption[] => {
    const AllKey = t("display.all", { ns: "labels" });

    // if the report has a default value, then add it to the list
    // currently that value is being set as "0"
    const defaultValue = report.searchCriteria.find(
      (c) => c.name === name
    )?.defaultValue;

    switch (name.toLowerCase().trim()) {
      case "locationid":
        if (defaultValue === "0") {
          return [{ value: "0", display: AllKey }, ...locationOptions];
        }
        return locationOptions;
      case "vehicleactivestatus":
        if (defaultValue === "0") {
          return [{ value: "0", display: AllKey }, ...activeInactiveOptions];
        }
        return activeInactiveOptions;
      case "vehiclestatus":
        if (defaultValue === "0") {
          return [{ value: "0", display: AllKey }, ...vehicleStatusOptions];
        }
        return vehicleStatusOptions;
      case "reservationstatus":
        if (defaultValue === "0") {
          return [{ value: "0", display: AllKey }, ...reservationStatusOptions];
        }
        return reservationStatusOptions;
      case "agreementstatus":
        if (defaultValue === "0") {
          return [{ value: "0", display: AllKey }, ...agreementStatusOptions];
        }
        return agreementStatusOptions;
      case "vehicletypeid":
        if (defaultValue === "0") {
          return [{ value: "0", display: AllKey }, ...vehicleTypeOptions];
        }
        return vehicleTypeOptions;
      default:
        return [];
    }
  };

  return {
    getList,
  };
}
