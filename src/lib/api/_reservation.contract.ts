import { z } from "zod";

import { c } from "@/lib/api/c";
import { AgreementStatusListSchema } from "@/lib/schemas/agreement";
import {
  ReservationDataSchema,
  ReservationListItemListSchema,
  ReservationTypeArraySchema,
} from "@/lib/schemas/reservation";

import {
  PaginationSchema,
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
  getList: {
    method: "GET",
    path: "/v3/reservations",
    query: UserAndClientIdAuthSchema.merge(PaginationSchema).extend({
      clientDate: z.string(),
      Statuses: z.array(z.string()).optional(),
      CreatedDateFrom: z.string().optional(),
      CreatedDateTo: z.string().optional(),
      SortDirection: z.string().optional(),
      CustomerId: z.string().optional(),
      VehicleId: z.string().optional(),
      VehicleNo: z.string().optional(),
      VehicleTypeId: z.string().optional(),
      CheckoutLocationId: z.string().optional(),
      CheckinLocationId: z.string().optional(),
      ReservationTypes: z.string().optional(),
      Keyword: z.string().optional(),
      ReservationNumber: z.string().optional(),
    }),
    responses: {
      200: ReservationListItemListSchema,
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
