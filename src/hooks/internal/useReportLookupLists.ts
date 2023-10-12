import { useGetAgreementStatusList } from "@/hooks/network/agreement/useGetAgreementStatusList";
import { useGetLocationsList } from "@/hooks/network/location/useGetLocationsList";
import { useGetReservationStatusList } from "@/hooks/network/reservation/useGetReservationStatusList";
import { useGetVehicleTypesLookupList } from "@/hooks/network/vehicle-type/useGetVehicleTypesLookup";
import { useGetVehicleStatusList } from "@/hooks/network/vehicle/useGetVehicleStatusList";

import { TReportDetail } from "@/schemas/report";

import type { ReportFilterOption } from "@/types/report";

type CriteriaList = TReportDetail["searchCriteria"];

function confirmRequirement(criteria: CriteriaList, lookup: string) {
  return criteria.some((c) => c.name.toLowerCase() === lookup.toLowerCase());
}

export function useReportLookupLists(report: TReportDetail) {
  // 1. BEGIN - lookup for locations
  const findLocations = confirmRequirement(report.searchCriteria, "LocationId");
  const locationsQuery = useGetLocationsList({
    query: { withActive: true },
    enabled: findLocations,
  });
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
  const agreementStatusesQuery = useGetAgreementStatusList({
    enabled: findAgreementStatuses,
  });
  const agreementStatusesList = agreementStatusesQuery.data ?? [];
  const agreementStatusOptions: ReportFilterOption[] =
    agreementStatusesList.map((status) => ({
      value: `${status.id}`,
      display: `${status.name}`,
    }));
  // END - lookup for agreement statuses

  // 3. BEGIN -  lookup for reservation statuses
  const findReservationStatuses = confirmRequirement(
    report.searchCriteria,
    "ReservationStatus"
  );
  const reservationStatusesQuery = useGetReservationStatusList({
    enabled: findReservationStatuses,
  });
  const reservationStatusesList = reservationStatusesQuery.data ?? [];
  const reservationStatusOptions: ReportFilterOption[] =
    reservationStatusesList.map((status) => ({
      value: `${status.id}`,
      display: `${status.name}`,
    }));
  // END - lookup for reservation statuses

  // 4. BEGIN - lookup for vehicle types
  const findVehicleTypes = confirmRequirement(
    report.searchCriteria,
    "VehicleTypeId"
  );
  const vehicleTypesQuery = useGetVehicleTypesLookupList({
    enabled: findVehicleTypes,
  });
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
  const vehicleStatusesQuery = useGetVehicleStatusList({
    enabled: findVehicleStatuses,
  });
  const vehicleStatusesList = vehicleStatusesQuery.data ?? [];
  const vehicleStatusOptions: ReportFilterOption[] = vehicleStatusesList.map(
    (status) => ({
      value: `${status.id}`,
      display: `${status.name}`,
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
    const defaultValue = report.searchCriteria.find((c) => c.name === name)
      ?.defaultValue;

    switch (name.toLowerCase().trim()) {
      case "locationid":
        if (defaultValue === "0") {
          return [{ value: "0", display: "All" }, ...locationOptions];
        }
        return locationOptions;
      case "vehicleactivestatus":
        if (defaultValue === "0") {
          return [{ value: "0", display: "All" }, ...activeInactiveOptions];
        }
        return activeInactiveOptions;
      case "vehiclestatus":
        if (defaultValue === "0") {
          return [{ value: "0", display: "All" }, ...vehicleStatusOptions];
        }
        return vehicleStatusOptions;
      case "reservationstatus":
        if (defaultValue === "0") {
          return [{ value: "0", display: "All" }, ...reservationStatusOptions];
        }
        return reservationStatusOptions;
      case "agreementstatus":
        if (defaultValue === "0") {
          return [{ value: "0", display: "All" }, ...agreementStatusOptions];
        }
        return agreementStatusOptions;
      case "vehicletypeid":
        if (defaultValue === "0") {
          return [{ value: "0", display: "All" }, ...vehicleTypeOptions];
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
