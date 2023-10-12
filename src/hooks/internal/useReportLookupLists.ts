import type { ReportFilterOption } from "@/components/report/filter";

import { useGetLocationsList } from "@/hooks/network/location/useGetLocationsList";

import { TReportDetail } from "@/schemas/report";

type CriteriaList = TReportDetail["searchCriteria"];

function confirmRequirement(criteria: CriteriaList, lookup: string) {
  return criteria.some((c) => c.name.toLowerCase() === lookup.toLowerCase());
}

export function useReportLookupLists(report: TReportDetail) {
  // lookup for locations
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

  // lookup to dynamically get list of options
  const getList = (name: string): ReportFilterOption[] => {
    const defaultValue = report.searchCriteria.find((c) => c.name === name)
      ?.defaultValue;

    switch (name.toLowerCase().trim()) {
      case "locationid":
        if (defaultValue === "0") {
          return [{ value: "0", display: "All" }, ...locationOptions];
        }
        return locationOptions;
      default:
        return [];
    }
  };

  return {
    getList,
  };
}
