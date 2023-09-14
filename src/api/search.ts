import { fetchAgreementsListModded } from "@/hooks/network/agreement/useGetAgreementsList";
import { fetchCustomersListModded } from "@/hooks/network/customer/useGetCustomersList";
import { fetchReservationsListModded } from "@/hooks/network/reservation/useGetReservationsList";
import { fetchVehiclesListModded } from "@/hooks/network/vehicle/useGetVehiclesList";

import type { TAgreementListItemParsed } from "@/schemas/agreement/searchResults";
import type { TCustomerListItemParsed } from "@/schemas/customer/searchResults";
import type { TReservationListItemParsed } from "@/schemas/reservation/searchResults";
import type { TVehicleListItemParsed } from "@/schemas/vehicle/searchResults";

import { type AppPrimaryModuleType } from "@/types/General";

import { type CommonAuthParams } from "./fetcher";

export type GlobalSearchReturnType = {
  module: AppPrimaryModuleType;
  referenceId: string;
  displayText: string;
  fullDisplayText: string;
}[];

export async function fetchGlobalSearchList(
  opts: CommonAuthParams & { currentDate: Date; searchTerm: string }
): Promise<GlobalSearchReturnType> {
  const { clientId, userId, accessToken, currentDate, searchTerm } = opts;

  if (!searchTerm) {
    return [];
  }

  const apiCalls = [
    fetchCustomersListModded({
      clientId,
      userId,
      accessToken,
      filters: { Keyword: searchTerm },
    }).catch(() => ({ data: [] as TCustomerListItemParsed[] })),
    fetchVehiclesListModded({
      clientId,
      userId,
      page: 1,
      pageSize: 50,
      LicenseNo: searchTerm,
    }).catch(() => ({ body: [] as TVehicleListItemParsed[], status: 900 })),
    fetchReservationsListModded({
      clientId,
      userId,
      clientDate: currentDate,
      page: 1,
      pageSize: 50,
      Keyword: searchTerm,
      Statuses: ["2", "6", "7"],
    }).catch(() => ({ body: [] as TReservationListItemParsed[], status: 900 })),
    fetchAgreementsListModded({
      clientId,
      userId,
      currentDate,
      page: 1,
      pageSize: 50,
      Keyword: searchTerm,
      Statuses: ["2", "5", "7"],
    }).catch(() => ({ body: [] as TAgreementListItemParsed[], status: 900 })),
  ] as const;

  return await Promise.all(apiCalls)
    .then((results) => {
      let returnableResults: GlobalSearchReturnType = [];

      const [
        customersPromise,
        vehiclesPromise,
        reservationsPromise,
        agreementsPromise,
      ] = results;

      const customers = customersPromise.data;
      const customerResults: GlobalSearchReturnType = customers.map(
        (customer) => {
          const displayText = `${customer.FullName}`;
          return {
            module: "customers",
            referenceId: `${customer.id}`,
            displayText,
            fullDisplayText: `Customers > ${displayText}`,
          };
        }
      );
      returnableResults = [...returnableResults, ...customerResults];

      const vehicles =
        vehiclesPromise?.status === 200 ? vehiclesPromise?.body : [];
      const vehicleResults: GlobalSearchReturnType = vehicles.map((vehicle) => {
        const displayText = `${vehicle.LicenseNo} ${vehicle.Year} ${vehicle.VehicleMakeName} ${vehicle.ModelName}`;
        return {
          module: "vehicles",
          referenceId: `${vehicle.id}`,
          displayText,
          fullDisplayText: `Vehicles > ${displayText}`,
        };
      });
      returnableResults = [...returnableResults, ...vehicleResults];

      const reservations =
        reservationsPromise?.status === 200 ? reservationsPromise?.body : [];
      const reservationResults: GlobalSearchReturnType = reservations.map(
        (res) => {
          const displayText = String(
            res.ReservationNumber +
              " | " +
              String(res.FirstName + " " + res.LastName).trim() +
              " - " +
              String(res.VehicleType) +
              (res.LicenseNo ? " - " + String(res.LicenseNo) : "")
          ).trim();
          return {
            module: "reservations",
            referenceId: `${res.id}`,
            displayText,
            fullDisplayText: `Reservations > ${displayText}`,
          };
        }
      );
      returnableResults = [...returnableResults, ...reservationResults];

      const agreements =
        agreementsPromise?.status === 200 ? agreementsPromise.body : [];
      const agreementResults: GlobalSearchReturnType = agreements.map(
        (agreement) => {
          const displayText = String(
            agreement.AgreementNumber +
              " | " +
              String(agreement.FullName).trim() +
              " - " +
              String(agreement.VehicleType) +
              " - " +
              String(agreement.LicenseNo)
          ).trim();
          return {
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
