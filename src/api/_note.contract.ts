import { z } from "zod";

import { c } from "@/api/c";

import { NotesDataListSchema } from "@/schemas/note";

import {
  ClientIdAuthSchema,
  StructuredErrorSchema,
  UnauthorizedErrorSchema,
} from "./helpers";

const rootNoteContract = c.router({
  getNotesByReferenceId: {
    method: "GET",
    path: "/v3/:referenceType/:referenceId/note",
    pathParams: z.object({
      referenceType: z.enum([
        "customers",
        "vehicles",
        "reservations",
        "agreements",
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
