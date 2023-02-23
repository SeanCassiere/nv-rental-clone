import classNames from "classnames";

const supportedList = [
  "Open",
  "Closed ",
  "Void",
  "Pending_Deposit",
  "Pending_Payment",
];

const AgreementStatusPill = (props: { status: string }) => {
  let statusName = props.status.trim();

  if (statusName === "Pending_Deposit") {
    statusName = "Pending Deposit";
  }
  if (statusName === "Pending_Payment") {
    statusName = "Pending Payment";
  }

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
