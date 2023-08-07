import { z } from "zod";

import { c } from "@/api/c";
import { UserAndClientIdAuthSchema } from "./helpers";
import { LocationSchemaArray } from "@/schemas/location";

const rootLocationContract = c.router({
  getLocations: {
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
