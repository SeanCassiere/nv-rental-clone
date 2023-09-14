import { AppPrimaryModuleType } from "@/types/General";

export const ReservationDateTimeColumns = [
  "CreatedDate",
  "StartDate",
  "EndDate",
];

export const AgreementDateTimeColumns = [
  "CreatedDate",
  "CheckoutDate",
  "CheckinDate",
  "ReturnDate",
];

export function getModuleApiName(module: AppPrimaryModuleType) {
  switch (module) {
    case "agreements":
      return {
        module: "agreement",
        moduleId: 4,
        capitalModule: "Agreement",
      } as const;
    case "customers":
      return {
        module: "customer",
        moduleId: 3,
        capitalModule: "Customer",
      } as const;
    case "vehicles":
      return {
        module: "vehicle",
        moduleId: 1,
        capitalModule: "Vehicle",
      } as const;
    case "reservations":
    default:
      return {
        module: "reservation",
        moduleId: 2,
        capitalModule: "Reservation",
      } as const;
  }
}

export function getSingularPrimaryModule(module: AppPrimaryModuleType) {
  switch (module) {
    case "agreements":
      return "agreement";
    case "customers":
      return "customer";
    case "vehicles":
      return "vehicle";
    case "reservations":
    default:
      return "reservation";
  }
}
