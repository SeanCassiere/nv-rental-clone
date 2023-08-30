import { z } from "zod";

import { c } from "@/api/c";

import { AgreementStatusListSchema } from "@/schemas/agreement";
import {
  ReservationDataSchema,
  ReservationTypeArraySchema,
} from "@/schemas/reservation";

import {
  // PaginationSchema,
  StructuredErrorSchema,
  UserAndClientIdAuthSchema,
} from "./helpers";

const rootReservationContract = c.router({
  getById: {
    method: "GET",
    path: "/v3/reservations/:reservationId",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: ReservationDataSchema,
      404: StructuredErrorSchema,
    },
  },
  getStatuses: {
    method: "GET",
    path: "/v3/reservations/statuses",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: AgreementStatusListSchema,
    },
  },
  getTypes: {
    method: "GET",
    path: "/v3/reservations/types",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: ReservationTypeArraySchema,
    },
  },
});

export { rootReservationContract };
