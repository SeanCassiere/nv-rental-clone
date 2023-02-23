import classNames from "classnames";

import { getAgreementStatusNameFromRaw } from "../PrimaryModule/ModuleStatBlock/AgreementModuleStatBlock";

const supportedList = [
  "Open",
  "Closed ",
  "Void",
  "Pending_Deposit",
  "Pending_Payment",
];

const AgreementStatusPill = (props: { status: string }) => {
  const statusName = getAgreementStatusNameFromRaw(props.status);

  return (
    <span
      className={classNames(
        "select-none rounded-full px-2.5 py-1.5 text-sm text-white",
        props.status === "Open" && "bg-green-500",
        props.status.trim() === "Closed" && "bg-red-500",
        props.status === "Void" && "bg-slate-900",
        props.status === "Pending_Deposit" && "bg-stone-500",
        props.status === "Pending_Payment" && "bg-indigo-500",
        // if not in supportedList
        !supportedList.includes(props.status) && "bg-slate-900"
      )}
    >
      {statusName}
    </span>
  );
};

export default AgreementStatusPill;
