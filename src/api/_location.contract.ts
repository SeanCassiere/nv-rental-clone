import { z } from "zod";

import { c } from "@/api/c";

import {
  CountriesListSchema,
  LocationByIdSchema,
  LocationSchemaArray,
  StatesListSchema,
} from "@/schemas/location";

import {
  StructuredErrorSchema,
  UnauthorizedErrorSchema,
  UserAndClientIdAuthSchema,
} from "./helpers";

const rootLocationContract = c.router({
  getById: {
    method: "GET",
    path: "/v3/locations/:locationId",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: LocationByIdSchema,
      401: UnauthorizedErrorSchema,
      404: StructuredErrorSchema,
    },
  },
  getCountries: {
    method: "GET",
    path: "/v3/locations/countries",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: CountriesListSchema,
      401: UnauthorizedErrorSchema,
      404: StructuredErrorSchema,
    },
  },
  getStatesByCountryId: {
    method: "GET",
    path: "/v3/locations/countries/:countryId/states",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: StatesListSchema,
      401: UnauthorizedErrorSchema,
      404: StructuredErrorSchema,
    },
  },
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
