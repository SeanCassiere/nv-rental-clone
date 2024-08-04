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
    body: z.object({
      isCheckin: z.boolean().optional(),
      agreementId: z.string().optional(),
      signatureImageUrl: z.string(),
      additionalDriverId: z.string().optional(),
      isAdditional: z.boolean().optional(),
    }),
    responses: {
      200: z.string(),
      204: z.string().or(z.undefined()),
      401: UnauthorizedErrorSchema,
      404: StructuredErrorSchema,
    },
  },
  uploadDigitalSignature: {
    method: "POST",
    path: "/v3/digitalsignature/uploadsignature",
    body: z.object({
      base64String: z.string(),
      imageName: z.string(),
      imageType: z.enum([".jpg"]),

      agreementId: z.string().or(z.number()),
      reservationId: z.string().or(z.number()),

      isCheckIn: z.boolean(),
      isDamageView: z.boolean(),

      driverId: z.string().optional(),
      additionalDriverId: z.string().optional(),

      signatureDate: z.string(),
      signatureImage: z.null(),
      signatureName: z.string().or(z.null()),
    }),
    responses: {
      200: z.any(),
      401: UnauthorizedErrorSchema,
      404: StructuredErrorSchema,
    },
  },
});

export { rootDigitalSignatureContract };
