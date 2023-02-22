import { useMemo } from "react";

import { useGetRentalRateTypesForRentals } from "../../hooks/network/rates/useGetRentalRateTypesForRental";
import {
  Button,
  NativeSelectInput,
  getSelectedOptionForSelectInput,
} from "../Form";
import type { StepRatesAndTaxesInformationProps } from "./StepRatesAndTaxesInformation";

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

  return (
    <code key="Hello" className="text-sm">
      <p>Selected rate name: {rateName ?? "not selected"}</p>
      <br />
      <div>
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
      <br />
      <p>Rate Data:</p>
      <p>
        <Button
          onClick={() => {
            if (rate) {
              props.onSelectedRate({ ...rate, hourlyRate: 100 });
            }
          }}
        >
          Save it
        </Button>
      </p>
      <div>
        <code className="break-all text-sm">
          <pre>{JSON.stringify(props.rate, null, 2)}</pre>
        </code>
      </div>
    </code>
  );
};

export default CommonRatesInformation;
