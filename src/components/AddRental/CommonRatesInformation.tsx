import { useGetRentalRateTypesForRentals } from "../../hooks/network/rates/useGetRentalRateTypesForRental";
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

  return (
    <code key="Hello" className="text-sm">
      <p>Selected rate name: {rateName ?? "not selected"}</p>
      <p>Rate Types</p>
      <div>
        <select
          value={rateName}
          onChange={(evt) => {
            props.onSelectRateName(evt.target.value);
          }}
        >
          <option value="">Select</option>
          {rateTypesData.data.map((rate) => (
            <option key={`rate-opt-${rate.rateId}`}>{rate.rateName}</option>
          ))}
        </select>
      </div>
      <p>Rate Data:</p>
      <p>
        <button
          onClick={() => {
            if (rate) {
              props.onSelectedRate({ ...rate, hourlyRate: 100 });
            }
          }}
        >
          Save it
        </button>
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
