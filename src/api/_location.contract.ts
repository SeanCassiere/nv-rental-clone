import { z } from "zod";

import { c } from "@/api/c";

import { LocationSchemaArray } from "@/schemas/location";

import { UserAndClientIdAuthSchema } from "./helpers";

const rootLocationContract = c.router({
  getList: {
    method: "GET",
    path: "/v3/locations",
    query: UserAndClientIdAuthSchema.extend({
      withActive: z.boolean(),
    }),
    responses: {
      200: LocationSchemaArray,
    },
  },
});

export { rootLocationContract };
