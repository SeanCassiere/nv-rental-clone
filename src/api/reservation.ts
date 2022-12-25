import { localDateToQueryYearMonthDay } from "../utils/date";
import { AgreementStatusListSchema } from "../utils/schemas/agreement";
import { ReservationDataSchema } from "../utils/schemas/reservation";
import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

export const fetchReservationsList = async (
  opts: {
    page: number;
    pageSize: number;
    clientDate: Date;
    filters: any;
  } & CommonAuthParams
) => {
  return await callV3Api(
    makeUrl(`/v3/reservations`, {
      ...opts.filters,
      clientDate: localDateToQueryYearMonthDay(opts.clientDate),
      Page: opts.page,
      PageSize: opts.pageSize,
      clientId: opts.clientId,
      userId: opts.userId,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  );
};

export const fetchReservationData = async (
  opts: {
    reservationId: string | number;
  } & CommonAuthParams
) => {
  return await callV3Api(
    makeUrl(`/v3/reservations/${opts.reservationId}`, {
      clientId: opts.clientId,
      userId: opts.userId,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => ReservationDataSchema.parse(res.data));
};

export const fetchReservationStatusesList = async (opts: CommonAuthParams) => {
  return await callV3Api(
    makeUrl(`/v3/reservations/statuses`, {
      clientId: opts.clientId,
      userId: opts.userId,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => AgreementStatusListSchema.parse(res.data));
};
