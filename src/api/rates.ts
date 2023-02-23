import { localDateTimeWithoutSecondsToQueryYearMonthDay } from "../utils/date";
import {
  OptimalRateSchema,
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
  ).then((res) => {
    if (Array.isArray(res.data)) {
      return res.data.map((rate) => RentalRateSchema.passthrough().parse(rate));
    }

    return [];
  });
}

export async function fetchRentalRateTypesForRental(
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

export async function fetchOptimalRateForRental(
  opts: CommonAuthParams & {
    VehicleTypeId: string;
    LocationId: string;
    CheckoutDate: Date;
    CheckinDate: Date;
  }
) {
  const { accessToken, userId, clientId, CheckoutDate, CheckinDate, ...rest } =
    opts;
  return await callV3Api(
    makeUrl("/v3/rates/ratesName/optimal", {
      clientId,
      // userId,
      CheckoutDate:
        localDateTimeWithoutSecondsToQueryYearMonthDay(CheckoutDate),
      CheckinDate: localDateTimeWithoutSecondsToQueryYearMonthDay(CheckinDate),
      ...rest,
    }),
    { headers: { Authorization: `Bearer ${accessToken}` } }
  ).then((res) => OptimalRateSchema.parse(res.data));
}
