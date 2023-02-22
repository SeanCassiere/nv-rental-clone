import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { StepRatesAndTaxesInformationProps } from "./StepRatesAndTaxesInformation";
import { useGetRentalRateTypesForRentals } from "../../hooks/network/rates/useGetRentalRateTypesForRental";
import { NativeSelectInput, getSelectedOptionForSelectInput } from "../Form";
import {
  RentalRateSchema,
  type RentalRateParsed,
} from "../../utils/schemas/rate";

interface CommonRatesInformationProps {
  module: StepRatesAndTaxesInformationProps["module"];
  isEdit: StepRatesAndTaxesInformationProps["isEdit"];
  rentalInformation: StepRatesAndTaxesInformationProps["rentalInformation"];
  vehicleInformation: StepRatesAndTaxesInformationProps["vehicleInformation"];

  rate: StepRatesAndTaxesInformationProps["rate"];
  onSelectedRate: StepRatesAndTaxesInformationProps["onSelectedRate"];
  rateName: StepRatesAndTaxesInformationProps["rateName"];
  onSelectRateName: StepRatesAndTaxesInformationProps["onSelectRateName"];
}

const CommonRatesInformation = (props: CommonRatesInformationProps) => {
  const { rentalInformation, vehicleInformation, rateName, rate } = props;

  const checkoutLocation = rentalInformation?.checkoutLocation || 0;
  const vehicleTypeId = vehicleInformation?.vehicleTypeId || 0;

  const rateTypesData = useGetRentalRateTypesForRentals({
    filters: {
      LocationId: String(checkoutLocation),
      VehicleTypeId: String(vehicleTypeId),
    },
  });

  const rateTypeOptions = useMemo(() => {
    const empty = { value: "", label: "Select" };
    if (!rateTypesData.data) return [empty];

    return [
      empty,
      ...rateTypesData.data.map((rateOption) => ({
        value: `${rateOption.rateName}`,
        label: `${rateOption.rateName}`,
      })),
    ];
  }, [rateTypesData.data]);

  const { handleSubmit, reset } = useForm<RentalRateParsed>({
    resolver: zodResolver(RentalRateSchema),
    defaultValues: useMemo(() => {
      return rate !== null ? rate : undefined;
    }, [rate]),
  });

  useEffect(() => {
    if (rate) {
      reset(rate);
    }
  }, [reset, rate, rate?.rateName, rateName]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="col-span-1">
          <NativeSelectInput
            label="Rate"
            value={getSelectedOptionForSelectInput(rateTypeOptions, rateName)}
            options={rateTypeOptions}
            onSelect={(value) => {
              if (value && value.value && value.value !== "") {
                props.onSelectRateName(value.value);
              }
            }}
          />
        </div>
        <div className="col-span-1">Number of days</div>
      </div>
      <form
        onSubmit={handleSubmit(
          (data) => {
            const valuesToSubmit = { ...data };
            // const valuesToSubmit = { ...rate, ...data };
            console.log("data", valuesToSubmit);
            props.onSelectedRate(valuesToSubmit);
          },
          (errors) => {
            console.log("errors", errors);
          }
        )}
        className="text-sm"
      >
        <p>Selected rate name: {rateName ?? "not selected"}</p>
        <br />
        <div></div>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CommonRatesInformation;
