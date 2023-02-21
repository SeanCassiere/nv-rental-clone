import classNames from "classnames";
import { useState } from "react";

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
      <p>Rate Types</p>
      <div className="flex gap-2">
        {rateTypesData.data.map((rate) => (
          <button
            key={rate.rateId}
            className={classNames(
              "p-2 text-white",
              selectedRateName === rate.rateName
                ? "bg-orange-500"
                : "bg-teal-500"
            )}
            onClick={() => {
              setSelectedRateName(rate.rateName ?? "");
            }}
          >
            {rate.rateName}
          </button>
        ))}
      </div>
      <p>Rates</p>
      <pre>{JSON.stringify(ratesData.data, null, 2)}</pre>
    </code>
  );
};

export default CommonRatesInformation;
