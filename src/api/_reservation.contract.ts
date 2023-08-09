import { z } from "zod";

import { c } from "@/api/c";
import {
  // PaginationSchema,
  StructuredErrorSchema,
  UserAndClientIdAuthSchema,
} from "./helpers";
import {
  ReservationDataSchema,
  ReservationTypeArraySchema,
} from "@/schemas/reservation";
import { AgreementStatusListSchema } from "@/schemas/agreement";

const rootReservationContract = c.router({
  getReservationById: {
    method: "GET",
    path: "/v3/reservations/:reservationId",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: ReservationDataSchema,
      404: StructuredErrorSchema,
    },
  },
  getReservationStatuses: {
    method: "GET",
    path: "/v3/reservations/statuses",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: AgreementStatusListSchema,
    },
  },
  getReservationTypes: {
    method: "GET",
    path: "/v3/reservations/types",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: ReservationTypeArraySchema,
    },
  },
});

export { rootReservationContract };
