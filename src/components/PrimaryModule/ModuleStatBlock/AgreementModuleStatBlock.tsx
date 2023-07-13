import { useTranslation } from "react-i18next";

import { cn } from "@/utils";
import { ModuleStatBlock, ModuleStatBlockContainer } from "./common";
import { type AgreementDataParsed } from "../../../utils/schemas/agreement";

const supportedList = [
  "Open",
  "Closed ",
  "Void",
  "Pending_Deposit",
  "Pending_Payment",
];
const getTextColorForStatus = (status: string) => {
  if (supportedList.includes(status)) {
    if (status === "Open") return "text-green-500";
    if (status === "Closed " || status === "Closed") return "text-red-500";
    if (status === "Void") return "text-slate-900";
    if (status === "Pending_Deposit") return "text-stone-500";
    if (status === "Pending_Payment") return "text-indigo-500";
  }
  return "text-slate-600";
};

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
          <span
            className={cn(
              "select-none text-xl font-semibold xl:text-2xl",
              getTextColorForStatus(agreement?.agreementStatusName ?? ""),
            )}
          >
            {agreement?.agreementStatusName
              ? String(agreement?.agreementStatusName)
              : "-"}
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
