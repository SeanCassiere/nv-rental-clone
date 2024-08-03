import { rootAgreementContract } from "./_agreement.contract";
import { rootClientContract } from "./_client.contract";
import { rootCustomerContract } from "./_customer.contract";
import { rootDashboardContract } from "./_dashboard.contract";
import { rootDigitalSignatureContract } from "./_digitalSignature.contract";
import { rootLocationContract } from "./_location.contract";
import { rootMiscChargeContract } from "./_misc-charge.contract";
import { rootNoteContract } from "./_note.contract";
import { rootRateTypeContract } from "./_rate-type";
import { rootRateContract } from "./_rate.contract";
import { rootReportContract } from "./_report.contract";
import { rootReservationContract } from "./_reservation.contract";
import { rootRolesContract } from "./_role.contract";
import { rootSummaryContract } from "./_summary.contract";
import { rootTaxContract } from "./_tax.contract";
import { rootUserContract } from "./_user.contract";
import { rootVehiclesExchangesContract } from "./_vehicle-exchange.contract";
import { rootVehicleTypesContract } from "./_vehicle-types.contract";
import { rootVehicleContract } from "./_vehicle.contract";
import { c } from "./c";

const contract = c.router(
  {
    agreement: rootAgreementContract,
    client: rootClientContract,
    customer: rootCustomerContract,
    dashboard: rootDashboardContract,
    digitalSignature: rootDigitalSignatureContract,
    location: rootLocationContract,
    miscCharge: rootMiscChargeContract,
    note: rootNoteContract,
    reservation: rootReservationContract,
    summary: rootSummaryContract,
    rate: rootRateContract,
    rateType: rootRateTypeContract,
    report: rootReportContract,
    role: rootRolesContract,
    tax: rootTaxContract,
    user: rootUserContract,
    vehicle: rootVehicleContract,
    vehicleExchange: rootVehiclesExchangesContract,
    vehicleType: rootVehicleTypesContract,
  },
  {
    strictStatusCodes: true,
    validateResponseOnClient: true,
  }
);

export { contract };
