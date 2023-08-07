import { c } from "./c";

import { rootAgreementContract } from "./_agreement.contract";
import { rootClientContract } from "./_client.contract";
import { rootLocationContract } from "./_location.contract";
import { rootUserContract } from "./_user.contract";

const contract = c.router(
  {
    ...rootAgreementContract,
    ...rootClientContract,
    ...rootLocationContract,
    ...rootUserContract,
  },
  {
    strictStatusCodes: true,
  }
);

export { contract };
