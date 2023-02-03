import { useTranslation } from "react-i18next";

import { ModuleStatBlock, ModuleStatBlockContainer } from "./common";
import { type AgreementDataParsed } from "../../../utils/schemas/agreement";

const AgreementModuleStatBlock = ({
  agreement,
  isCheckedIn,
}: {
  agreement?: AgreementDataParsed | null;
  isCheckedIn?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <ModuleStatBlockContainer
      title="Overview"
      subtitle="See what's going on with this rental."
    >
      <ModuleStatBlock
        header="Status"
        stat={
          <span className="select-none text-xl font-semibold text-slate-600 xl:text-2xl">
            {agreement?.agreementStatusName ?? "-"}
          </span>
        }
      />
      <ModuleStatBlock
        header="Agreement type"
        stat={
          <span className="select-none text-xl font-semibold text-slate-600 xl:text-2xl">
            {agreement?.agreementType ?? "-"}
          </span>
        }
      />
      <ModuleStatBlock
        header="Vehicle type"
        stat={
          <span className="select-none text-xl font-semibold text-slate-600 xl:text-2xl">
            {agreement?.vehicleType ?? "-"}
          </span>
        }
      />
      <ModuleStatBlock
        header="Checkout date"
        stat={
          <span className="select-none truncate text-xl font-semibold text-slate-600 xl:text-2xl">
            {agreement?.checkoutDate
              ? t("intlDateTime", {
                  value: agreement?.checkoutDate,
                })
              : "-"}
          </span>
        }
      />
      <ModuleStatBlock
        header="Checkout location"
        stat={
          <span className="select-none text-xl font-semibold text-slate-600 xl:text-2xl">
            {agreement?.checkoutLocationName ?? "-"}
          </span>
        }
      />
      <ModuleStatBlock
        header="Checkin date"
        stat={
          <span className="select-none text-xl font-semibold text-slate-600 xl:text-2xl">
            {agreement?.checkinDate
              ? t("intlDateTime", {
                  value: agreement?.checkinDate,
                })
              : "-"}
          </span>
        }
      />
      <ModuleStatBlock
        header="Checkin location"
        stat={
          <span className="select-none text-xl font-semibold text-slate-600 xl:text-2xl">
            {agreement?.checkinLocationName ?? "-"}
          </span>
        }
      />
      {isCheckedIn && agreement?.returnDate && (
        <ModuleStatBlock
          header="Return date"
          stat={
            <span className="select-none text-xl font-semibold text-slate-600 xl:text-2xl">
              {agreement?.returnDate
                ? t("intlDateTime", {
                    value: agreement?.returnDate,
                  })
                : "-"}
            </span>
          }
        />
      )}
    </ModuleStatBlockContainer>
  );
};

export default AgreementModuleStatBlock;
