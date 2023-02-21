import { useGetRentalRates } from "../../hooks/network/rates/useGetRentalRates";
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

  const data = useGetRentalRates({
    enabled: hasCheckoutInfo && hasVehicleInfo,
    filters: {
      LocationId: Number(checkoutLocation).toString(),
      RateName: "base",
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
      <pre>{JSON.stringify(data.data, null, 2)}</pre>
    </code>
  );
};

export default CommonRatesInformation;
