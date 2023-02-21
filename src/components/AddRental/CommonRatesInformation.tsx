import { useState } from "react";
import { useGetOptimalRateForRental } from "../../hooks/network/rates/useGetOptimalRateForRental";

import { useGetRentalRates } from "../../hooks/network/rates/useGetRentalRates";
import { useGetRentalRateTypesForRentals } from "../../hooks/network/rates/useGetRentalRateTypesForRental";
import type { StepRatesAndTaxesInformationProps } from "./StepRatesAndTaxesInformation";

interface CommonRatesInformationProps {
  module: StepRatesAndTaxesInformationProps["module"];
  isEdit: StepRatesAndTaxesInformationProps["isEdit"];
  rentalInformation: StepRatesAndTaxesInformationProps["rentalInformation"];
  vehicleInformation: StepRatesAndTaxesInformationProps["vehicleInformation"];
}

const CommonRatesInformation = (props: CommonRatesInformationProps) => {
  const { rentalInformation, vehicleInformation } = props;

  const checkoutLocation = rentalInformation?.checkoutLocation || 0;
  const vehicleTypeId = vehicleInformation?.vehicleTypeId || 0;

  const hasCheckoutInfo = Boolean(rentalInformation);
  const hasVehicleInfo = Boolean(vehicleInformation);

  const [selectedRateName, setSelectedRateName] = useState("");

  useGetOptimalRateForRental({
    filters: {
      CheckoutDate: rentalInformation?.checkoutDate ?? new Date(),
      CheckinDate: rentalInformation?.checkinDate ?? new Date(),
      VehicleTypeId: String(vehicleTypeId),
      LocationId: String(checkoutLocation),
    },
    onSuccess: (data) => {
      if (data && data?.rateName) {
        setSelectedRateName((prev) => {
          if (prev === "" && data.rateName !== null) {
            return data.rateName;
          }
          return prev;
        });
      }
    },
    enabled: props.isEdit === false && selectedRateName === "",
  });

  const rateTypesData = useGetRentalRateTypesForRentals({
    filters: {
      LocationId: String(checkoutLocation),
      VehicleTypeId: String(vehicleTypeId),
    },
  });

  const ratesData = useGetRentalRates({
    enabled: hasCheckoutInfo && hasVehicleInfo && Boolean(selectedRateName),
    filters: {
      LocationId: Number(checkoutLocation).toString(),
      RateName: selectedRateName,
      CheckoutDate: rentalInformation?.checkoutDate,
      CheckinDate: rentalInformation?.checkinDate,
      VehicleTypeId: Number(vehicleTypeId).toString(),
      ...(props.module === "agreements"
        ? {
            AgreementId: rentalInformation?.rentalReferenceId,
            AgreementTypeName: rentalInformation?.rentalType,
          }
        : {}),
    },
  });
  return (
    <code key="Hello" className="text-sm">
      <p>Selected rate name: {selectedRateName ?? "not selected"}</p>
      <p>Rate Types</p>
      <div className="">
        <select
          value={selectedRateName}
          onChange={(evt) => {
            setSelectedRateName(evt.target.value);
          }}
        >
          <option value="">Select</option>
          {rateTypesData.data.map((rate) => (
            <option key={`rate-opt-${rate.rateId}`}>{rate.rateName}</option>
          ))}
        </select>
      </div>
      {selectedRateName !== "" && (
        <>
          <p>Rates</p>
          <pre>{JSON.stringify(ratesData.data, null, 2)}</pre>
        </>
      )}
    </code>
  );
};

export default CommonRatesInformation;
