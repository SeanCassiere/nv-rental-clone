import { z } from "zod";

import { c } from "@/lib/api/c";
import { DigitalSignatureDriverSchema } from "@/lib/schemas/digital-signature/driverList";

import { StructuredErrorSchema, UnauthorizedErrorSchema } from "./helpers";

const rootDigitalSignatureContract = c.router({
  getDriversList: {
    method: "GET",
    path: "/v3/digitalsignature/additionaldriverlist",
    query: z.object({
      agreementId: z.string().optional(),
      reservationId: z.string().optional(),
    }),
    responses: {
      200: z.array(DigitalSignatureDriverSchema),
    },
  },
  getDigitalSignatureImageUrl: {
    method: "POST",
    path: "/v3/digitalsignature/reloadsignatureimageurl",
    responses: {
      200: z.string(),
      204: z.string().or(z.undefined()),
      401: UnauthorizedErrorSchema,
      404: StructuredErrorSchema,
    },
    body: z.object({
      isCheckin: z.boolean(),
      agreementId: z.string(),
      signatureImageUrl: z.string(),
    }),
  },
});

export { rootDigitalSignatureContract };
