import classNames from "classnames";

const supportedList = ["Open", "CheckOut", "Canceled", "Quote", "New"];

const ReservationStatusPill = (props: { status: string }) => {
  let statusName = props.status.trim();

  if (statusName === "Canceled") {
    statusName = "Cancelled";
  }

  return (
    <span
      className={classNames(
        "select-none rounded-full px-2.5 py-1.5 text-sm text-white",
        props.status === "Open" && "bg-green-500",
        props.status.trim() === "Canceled" && "bg-red-500",
        props.status === "CheckOut" && "bg-orange-500",
        props.status === "Quote" && "bg-stone-500",
        props.status === "New" && "bg-indigo-500",
        // if not in supportedList
        !supportedList.includes(props.status) && "bg-slate-900"
      )}
    >
      {statusName}
    </span>
  );
};

export default ReservationStatusPill;
