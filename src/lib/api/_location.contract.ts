import { z } from "zod";

import { c } from "@/lib/api/c";
import {
  CountriesListSchema,
  LocationByIdSchema,
  LocationSchemaArray,
  StatesListSchema,
  type UpdateLocationInput,
} from "@/lib/schemas/location";

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
  createLocation: {
    method: "POST",
    path: "/v3/locations",
    body: c.type<UpdateLocationInput>(),
    responses: {
      200: z.any(),
      201: z.any(),
      401: UnauthorizedErrorSchema,
      404: StructuredErrorSchema,
    },
  },
  updateLocationById: {
    method: "PUT",
    path: "/v3/locations/:locationId",
    body: c.type<UpdateLocationInput>(),
    responses: {
      200: z.any(),
      401: UnauthorizedErrorSchema,
      404: StructuredErrorSchema,
    },
  },
});

export { rootLocationContract };
