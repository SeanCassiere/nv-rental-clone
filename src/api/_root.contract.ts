import { c } from "./c";

import { rootAgreementContract } from "./_agreement.contract";
import { rootClientContract } from "./_client.contract";
import { rootCustomerContract } from "./_customer.contract";
import { rootDashboardContract } from "./_dashboard.contract";
import { rootLocationContract } from "./_location.contract";
import { rootMiscChargeContract } from "./_misc-charge.contract";
import { rootNoteContract } from "./_note.contract";
import { rootReservationContract } from "./_reservation.contract";
import { rootTaxContract } from "./_tax.contract";
import { rootUserContract } from "./_user.contract";
import { rootVehicleContract } from "./_vehicle.contract";
import { rootVehiclesExchangesContract } from "./_vehicle-exchanges.contract";
import { rootVehicleTypesContract } from "./_vehicle-types.contract";

const contract = c.router(
  {
    ...rootAgreementContract,
    ...rootClientContract,
    ...rootCustomerContract,
    ...rootDashboardContract,
    ...rootLocationContract,
    ...rootMiscChargeContract,
    ...rootNoteContract,
    ...rootReservationContract,
    ...rootTaxContract,
    ...rootUserContract,
    ...rootVehicleContract,
    ...rootVehiclesExchangesContract,
    ...rootVehicleTypesContract,
  },
  {
    strictStatusCodes: true,
  }
);

export { contract };
