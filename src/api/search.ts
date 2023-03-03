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

type InternalAppSearchResultItem = {
  type: "internal";
  location: string;
};

export type GlobalSearchReturnType = (
  | NetworkSearchResultItem
  | InternalAppSearchResultItem
)[];

export async function fetchGlobalSearchList(
  opts: CommonAuthParams & { currentDate: Date; searchTerm: string }
): Promise<GlobalSearchReturnType> {
  const { clientId, userId, accessToken, currentDate, searchTerm } = opts;

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
      filters: { ReservationNumber: searchTerm },
      clientDate: currentDate,
    }),
    fetchAgreementsListModded({
      clientId,
      userId,
      accessToken,
      filters: { AgreementNumber: searchTerm },
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
        }
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
        }
      );
      returnableResults = [...returnableResults, ...vehicleResults];

      const reservations = results[2].data;
      const reservationResults: NetworkSearchResultItem[] = reservations.map(
        (res) => {
          const displayText = String(
            res.ReservationNumber +
              " | " +
              String(res.FirstName + " " + res.LastName).trim() +
              (res.LicenseNo ? " - " + String(res.LicenseNo) : "")
          ).trim();
          return {
            type: "network",
            module: "reservations",
            referenceId: `${res.id}`,
            displayText,
            fullDisplayText: `Reservations > ${displayText}`,
          };
        }
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
              String(agreement.LicenseNo)
          ).trim();
          return {
            type: "network",
            module: "agreements",
            referenceId: `${agreement.id}`,
            displayText,
            fullDisplayText: `Agreements > ${displayText}`,
          };
        }
      );
      returnableResults = [...returnableResults, ...agreementResults];

      return returnableResults;
    })
    .catch((e) => {
      console.error("global search error: ", e);
      return [];
    });
}
