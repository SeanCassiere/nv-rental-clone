import { rootAgreementContract } from "./_agreement.contract";
import { rootClientContract } from "./_client.contract";
import { rootCustomerContract } from "./_customer.contract";
import { rootDashboardContract } from "./_dashboard.contract";
import { rootLocationContract } from "./_location.contract";
import { rootMiscChargeContract } from "./_misc-charge.contract";
import { rootNoteContract } from "./_note.contract";
import { rootRateTypeContract } from "./_rate-type";
import { rootRateContract } from "./_rate.contract";
import { rootReservationContract } from "./_reservation.contract";
import { rootSummaryContract } from "./_summary.contract";
import { rootTaxContract } from "./_tax.contract";
import { rootUserContract } from "./_user.contract";
import { rootVehiclesExchangesContract } from "./_vehicle-exchanges.contract";
import { rootVehicleTypesContract } from "./_vehicle-types.contract";
import { rootVehicleContract } from "./_vehicle.contract";
import { c } from "./c";

const contract = c.router(
  {
    agreement: rootAgreementContract,
    client: rootClientContract,
    customer: rootCustomerContract,
    dashboard: rootDashboardContract,
    exchange: rootVehiclesExchangesContract,
    location: rootLocationContract,
    miscCharge: rootMiscChargeContract,
    note: rootNoteContract,
    reservation: rootReservationContract,
    summary: rootSummaryContract,
    rate: rootRateContract,
    rateType: rootRateTypeContract,
    tax: rootTaxContract,
    user: rootUserContract,
    vehicle: rootVehicleContract,
    vehicleType: rootVehicleTypesContract,
  },
  {
    strictStatusCodes: true,
    validateResponseOnClient: true,
  }
);

export { contract };
