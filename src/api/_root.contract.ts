import { c } from "./c";

import { rootAgreementContract } from "./_agreement.contract";
import { rootClientContract } from "./_client.contract";
import { rootDashboardContract } from "./_dashboard.contract";
import { rootLocationContract } from "./_location.contract";
import { rootMiscChargeContract } from "./_misc-charge.contract";
import { rootTaxContract } from "./_tax.contract";
import { rootUserContract } from "./_user.contract";

const contract = c.router(
  {
    ...rootAgreementContract,
    ...rootClientContract,
    ...rootDashboardContract,
    ...rootLocationContract,
    ...rootMiscChargeContract,
    ...rootTaxContract,
    ...rootUserContract,
  },
  {
    strictStatusCodes: true,
  }
);

export { contract };
