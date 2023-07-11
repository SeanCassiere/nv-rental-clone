import { type CommonAuthParams } from "./fetcher";
import { type AppPrimaryModuleType } from "../types/General";

import { fetchCustomersListModded } from "../hooks/network/customer/useGetCustomersList";
import { fetchVehiclesListModded } from "../hooks/network/vehicle/useGetVehiclesList";
import { fetchReservationsListModded } from "../hooks/network/reservation/useGetReservationsList";
import { fetchAgreementsListModded } from "../hooks/network/agreement/useGetAgreementsList";

type NetworkSearchResultItem = {
  type: "network";
  module: AppPrimaryModuleType;
  referenceId: string;
  displayText: string;
  fullDisplayText: string;
};

type DestinationTypes =
  | "search-customers"
  | "search-vehicles"
  | "search-fleet"
  | "search-reservations"
  | "search-agreements"
  | "dashboard";

type InternalAppSearchResultItem = {
  type: "internal";
  destination: DestinationTypes;
};

export type GlobalSearchReturnType = (
  | NetworkSearchResultItem
  | InternalAppSearchResultItem
)[];

const storedInternalSearches: {
  searchText: string;
  destination: DestinationTypes;
}[] = [
  { searchText: "dashboard", destination: "dashboard" },
  { searchText: "home", destination: "dashboard" },
  { searchText: "customers", destination: "search-customers" },
  { searchText: "vehicles", destination: "search-vehicles" },
  { searchText: "fleet", destination: "search-fleet" },
  { searchText: "reservations", destination: "search-reservations" },
  { searchText: "agreements", destination: "search-agreements" },
];

export async function fetchGlobalSearchList(
  opts: CommonAuthParams & { currentDate: Date; searchTerm: string },
): Promise<GlobalSearchReturnType> {
  const { clientId, userId, accessToken, currentDate, searchTerm } = opts;

  const internalSearches: InternalAppSearchResultItem[] = [];

  storedInternalSearches.forEach((item) => {
    if (item.searchText.toLowerCase().includes(searchTerm.toLowerCase().trim()))
      internalSearches.push({
        type: "internal",
        destination: item.destination,
      });
  });

  const apiCalls = [
    fetchCustomersListModded({
      clientId,
      userId,
      accessToken,
      filters: { Keyword: searchTerm },
    }),
    fetchVehiclesListModded({
      clientId,
      userId,
      accessToken,
      filters: { LicenseNo: searchTerm },
    }),
    fetchReservationsListModded({
      clientId,
      userId,
      accessToken,
      filters: { Keyword: searchTerm, Statuses: [2, 6, 7] },
      clientDate: currentDate,
    }),
    fetchAgreementsListModded({
      clientId,
      userId,
      accessToken,
      filters: { Keyword: searchTerm, Statuses: [2, 5, 7] },
      currentDate,
    }),
  ] as const;

  return await Promise.all(apiCalls)
    .then((results) => {
      let returnableResults: GlobalSearchReturnType = [];

      const customers = results[0].data;
      const customerResults: NetworkSearchResultItem[] = customers.map(
        (customer) => {
          const displayText = `${customer.FullName}`;
          return {
            type: "network",
            module: "customers",
            referenceId: `${customer.id}`,
            displayText,
            fullDisplayText: `Customers > ${displayText}`,
          };
        },
      );
      returnableResults = [...returnableResults, ...customerResults];

      const vehicles = results[1].data;
      const vehicleResults: NetworkSearchResultItem[] = vehicles.map(
        (vehicle) => {
          const displayText = `${vehicle.LicenseNo} ${vehicle.Year} ${vehicle.VehicleMakeName} ${vehicle.ModelName}`;
          return {
            type: "network",
            module: "vehicles",
            referenceId: `${vehicle.id}`,
            displayText,
            fullDisplayText: `Vehicles > ${displayText}`,
          };
        },
      );
      returnableResults = [...returnableResults, ...vehicleResults];

      const reservations = results[2].data;
      const reservationResults: NetworkSearchResultItem[] = reservations.map(
        (res) => {
          const displayText = String(
            res.ReservationNumber +
              " | " +
              String(res.FirstName + " " + res.LastName).trim() +
              " - " +
              String(res.VehicleType) +
              (res.LicenseNo ? " - " + String(res.LicenseNo) : ""),
          ).trim();
          return {
            type: "network",
            module: "reservations",
            referenceId: `${res.id}`,
            displayText,
            fullDisplayText: `Reservations > ${displayText}`,
          };
        },
      );
      returnableResults = [...returnableResults, ...reservationResults];

      const agreements = results[3].data;
      const agreementResults: NetworkSearchResultItem[] = agreements.map(
        (agreement) => {
          const displayText = String(
            agreement.AgreementNumber +
              " | " +
              String(agreement.FullName).trim() +
              " - " +
              String(agreement.VehicleType) +
              " - " +
              String(agreement.LicenseNo),
          ).trim();
          return {
            type: "network",
            module: "agreements",
            referenceId: `${agreement.id}`,
            displayText,
            fullDisplayText: `Agreements > ${displayText}`,
          };
        },
      );
      returnableResults = [...returnableResults, ...agreementResults];

      return [...internalSearches, ...returnableResults];
    })
    .catch((e) => {
      console.error("global search error: ", e);
      return [...internalSearches];
    });
}
