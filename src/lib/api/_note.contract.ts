import { z } from "zod";

import { c } from "@/lib/api/c";
import { NotesDataListSchema } from "@/lib/schemas/note";

import {
  ClientIdAuthSchema,
  StructuredErrorSchema,
  UnauthorizedErrorSchema,
} from "./helpers";

const rootNoteContract = c.router({
  getListForRefId: {
    method: "GET",
    path: "/v3/:referenceType/:referenceId/note",
    pathParams: z.object({
      referenceType: z.enum([
        "customer",
        "vehicle",
        "reservation",
        "agreement",
      ]),
      referenceId: z.string(),
    }),
    query: ClientIdAuthSchema,
    responses: {
      200: NotesDataListSchema,
      401: UnauthorizedErrorSchema,
      404: StructuredErrorSchema,
    },
  },
});

export { rootNoteContract };
