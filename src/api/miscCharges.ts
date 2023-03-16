import { localDateTimeWithoutSecondsToQueryYearMonthDay } from "../utils/date";
import { MiscChargeListItemSchema } from "../utils/schemas/misCharges";
import { callV3Api, type CommonAuthParams, makeUrl } from "./fetcher";

export async function fetchMiscCharges(
  opts: CommonAuthParams & {
    Active?: boolean;
    LocationId?: string | number;
    VehicleTypeId?: string | number;
    CheckoutDate?: Date;
    CheckinDate?: Date;
  }
) {
  const {
    accessToken,
    clientId,
    userId,
    CheckoutDate,
    CheckinDate,
    Active,
    ...rest
  } = opts;

  const search = {
    ...rest,
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
    ...(Active ? { Active: Active ? "true" : "false" } : {}),
    clientId,
    userId,
  };

  return await callV3Api(makeUrl(`/v3/miscCharges`, search), {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then((res) => {
    if (Array.isArray(res.data)) {
      return (res.data || []).map((item) =>
        MiscChargeListItemSchema.passthrough().parse(item)
      );
    }
    return [];
  });
}
