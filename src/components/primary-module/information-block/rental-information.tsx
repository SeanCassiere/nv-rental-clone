import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BanknoteIcon } from "lucide-react";

import {
  InformationBlockCard,
  type TAnyCustomerValueType,
  type TInformationBlockCardProps,
  EMPTY_KEY,
  isUndefined,
} from "./common";

interface TRentalInformationProps {
  currency?: string;
  data: {
    totalDays?: TAnyCustomerValueType;
    rateName?: TAnyCustomerValueType;
    dailyMilesAllowed?: TAnyCustomerValueType;
    weeklyMilesAllowed?: TAnyCustomerValueType;
    monthlyMilesAllowed?: TAnyCustomerValueType;
    hourlyRate?: TAnyCustomerValueType;
    halfHourlyRate?: TAnyCustomerValueType;
    dailyRate?: TAnyCustomerValueType;
    halfDayRate?: TAnyCustomerValueType;
    weekendRate?: TAnyCustomerValueType;
    weeklyRate?: TAnyCustomerValueType;
    monthlyRate?: TAnyCustomerValueType;
    additionalMileageFee?: TAnyCustomerValueType;
    destination?: TAnyCustomerValueType;
  };
  isLoading: boolean;
  mode: "agreement" | "reservation";
}

const RentalInformation = (props: TRentalInformationProps) => {
  const { data, mode, isLoading, currency } = props;
  const { t } = useTranslation();

  const infoBlocks = useMemo(() => {
    const blocks: TInformationBlockCardProps["blocks"] = [];
    const pushTotalDays = () => {
      blocks.push({
        heading: "Total no. of days",
        value: !isUndefined(data?.totalDays) ? `${data?.totalDays}` : EMPTY_KEY,
      });
    };
    const pushDestination = () => {
      blocks.push({
        heading: "Destination",
        value: data?.destination || EMPTY_KEY,
      });
    };
    const pushRateName = () => {
      blocks.push({
        heading: "Rate name",
        value: data?.rateName || EMPTY_KEY,
      });
    };
    const pushDailyMilesAllowed = () => {
      blocks.push({
        heading: "Daily miles allowed",
        value: data?.dailyMilesAllowed || EMPTY_KEY,
      });
    };
    const pushWeeklyMilesAllowed = () => {
      blocks.push({
        heading: "Weekly miles allowed",
        value: data?.weeklyMilesAllowed || EMPTY_KEY,
      });
    };
    const pushMonthlyMilesAllowed = () => {
      blocks.push({
        heading: "Monthly miles allowed",
        value: data?.monthlyMilesAllowed || EMPTY_KEY,
      });
    };
    const pushHourlyRate = () => {
      blocks.push({
        heading: "Hourly rate",
        value: data?.hourlyRate
          ? t("intlCurrency", { currency, value: Number(data.hourlyRate) })
          : EMPTY_KEY,
      });
    };
    const pushHalfDayRate = () => {
      blocks.push({
        heading: "Half day rate",
        value: data?.halfDayRate
          ? t("intlCurrency", { currency, value: Number(data.halfDayRate) })
          : EMPTY_KEY,
      });
    };
    const pushDailyRate = () => {
      blocks.push({
        heading: "Daily rate",
        value: data?.dailyRate
          ? t("intlCurrency", { currency, value: Number(data.dailyRate) })
          : EMPTY_KEY,
      });
    };
    const pushWeeklyRate = () => {
      blocks.push({
        heading: "Weekly rate",
        value: data?.weeklyRate
          ? t("intlCurrency", { currency, value: Number(data.weeklyRate) })
          : EMPTY_KEY,
      });
    };
    const pushMonthlyRate = () => {
      blocks.push({
        heading: "Monthly rate",
        value: data?.monthlyRate
          ? t("intlCurrency", { currency, value: Number(data.monthlyRate) })
          : EMPTY_KEY,
      });
    };
    const pushWeekendRate = () => {
      blocks.push({
        heading: "Weekend rate",
        value: data?.weekendRate
          ? t("intlCurrency", { currency, value: Number(data.weekendRate) })
          : EMPTY_KEY,
      });
    };
    const pushAdditionalMileageFeeRate = () => {
      blocks.push({
        heading: "Extra mileage fee",
        value: data?.additionalMileageFee
          ? t("intlCurrency", {
              currency,
              value: Number(data.additionalMileageFee),
            })
          : EMPTY_KEY,
      });
    };

    const generalList = () => {
      pushTotalDays();
      pushRateName();
      pushDailyMilesAllowed();
      pushWeeklyMilesAllowed();
      pushMonthlyMilesAllowed();
      pushHourlyRate();
      pushHalfDayRate();
      pushDailyRate();
      pushWeeklyRate();
      pushMonthlyRate();
      pushWeekendRate();
      pushAdditionalMileageFeeRate();
      pushDestination();
    };
    if (mode === "agreement") {
      generalList();
    }
    if (mode === "reservation") {
      generalList();
    }

    return blocks;
  }, [t, data, mode, currency]);
  return (
    <InformationBlockCard
      identifier="rental-information"
      icon={<BanknoteIcon className="h-5 w-5" />}
      title="Rental information"
      blocks={infoBlocks}
      numberPerBlock={4}
      isLoading={isLoading}
    />
  );
};

export default RentalInformation;
