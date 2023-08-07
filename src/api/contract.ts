import { initContract } from "@ts-rest/core";

import { rootAgreementContract } from "./_agreement.contract";
import { rootClientContract } from "./_client.contract";
import { rootUserContract } from "./_user.contract";

export const c = initContract();

const contract = c.router(
  {
    ...rootAgreementContract,
    ...rootClientContract,
    ...rootUserContract,
  },
  {
    strictStatusCodes: true,
  }
);

export { contract };
