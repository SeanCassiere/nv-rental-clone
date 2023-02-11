import { type AgreementRentalInformationSchemaParsed } from "./AgreementRentalInformationTab";

const AgreementVehicleInformationTab = ({
  rentalInformation,
}: {
  rentalInformation: AgreementRentalInformationSchemaParsed | undefined;
  onCompleted: () => void;
  isEdit: boolean;
}) => {
  const checkoutLocation = rentalInformation?.checkoutLocation || 0;

  return (
    <div>
      {!checkoutLocation && <span>Location not selected</span>}
      <p>AgreementVehicleInformationTab</p>
    </div>
  );
};

export default AgreementVehicleInformationTab;
