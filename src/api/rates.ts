import { z } from "zod";
import { localDateTimeWithoutSecondsToQueryYearMonthDay } from "../utils/date";
import {
  RentalRateSchema,
  RentalRateTypeListSchema,
} from "../utils/schemas/rate";
import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

type StringOrNumber = string | number;

export async function fetchRentalRates(
  opts: CommonAuthParams & {
    VehicleTypeId?: StringOrNumber;
    CheckoutDate?: Date;
    CheckinDate?: Date;
    LocationId?: string;
    RateName?: string;
    AgreementId?: string;
    AgreementTypeName?: string;
  }
) {
  const {
    clientId,
    userId,
    accessToken,
    CheckoutDate,
    CheckinDate,
    ...others
  } = opts;
  return await callV3Api(
    makeUrl("/v3/rates", {
      clientId,
      userId,
      ...(CheckoutDate
        ? {
            CheckoutDate:
              localDateTimeWithoutSecondsToQueryYearMonthDay(CheckoutDate),
          }
        : {}),
      ...(CheckinDate
        ? {
            CheckinDate:
              localDateTimeWithoutSecondsToQueryYearMonthDay(CheckinDate),
          }
        : {}),
      ...others,
    }),
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  ).then((res) => z.array(RentalRateSchema).parse(res.data));
}

export async function fetchRentalRateTypes(
  opts: CommonAuthParams & { LocationId: string; VehicleTypeId: string }
) {
  const { clientId, userId, accessToken, ...rest } = opts;
  return await callV3Api(
    makeUrl("/v3/rateTypes", { clientId, userId, ...rest }),
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  ).then((res) => RentalRateTypeListSchema.parse(res.data));
}
