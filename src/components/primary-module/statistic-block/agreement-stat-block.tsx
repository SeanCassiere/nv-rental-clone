import { useTranslation } from "react-i18next";

import { type AgreementDataParsed } from "../../../lib/schemas/agreement";
import { ModuleStatBlock, ModuleStatBlockContainer } from "./common";

const AgreementStatBlock = ({
  agreement,
  isCheckedIn,
}: {
  agreement?: AgreementDataParsed | null;
  isCheckedIn?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <ModuleStatBlockContainer>
      <ModuleStatBlock
        header="Status"
        stat={
          agreement?.agreementStatusName
            ? String(agreement?.agreementStatusName)
            : "-"
        }
      />
      <ModuleStatBlock
        header="Agreement type"
        stat={agreement?.agreementType ?? "-"}
      />
      <ModuleStatBlock
        header="Vehicle type"
        stat={agreement?.vehicleType ?? "-"}
      />
      <ModuleStatBlock
        header="Checkout date"
        stat={
          agreement?.checkoutDate
            ? t("intlDateTime", {
                value: agreement?.checkoutDate,
                ns: "format",
              })
            : "-"
        }
      />
      <ModuleStatBlock
        header="Checkout location"
        stat={agreement?.checkoutLocationName ?? "-"}
      />
      <ModuleStatBlock
        header="Checkin date"
        stat={
          agreement?.checkinDate
            ? t("intlDateTime", {
                value: agreement?.checkinDate,
                ns: "format",
              })
            : "-"
        }
      />
      <ModuleStatBlock
        header="Checkin location"
        stat={agreement?.checkinLocationName ?? "-"}
      />
      {isCheckedIn && agreement?.returnDate && (
        <ModuleStatBlock
          header="Return date"
          stat={
            agreement?.returnDate
              ? t("intlDateTime", {
                  value: agreement?.returnDate,
                  ns: "format",
                })
              : "-"
          }
        />
      )}
    </ModuleStatBlockContainer>
  );
};

export default AgreementStatBlock;
