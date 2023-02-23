import classNames from "classnames";
import { getVehicleStatusNameFromRaw } from "../PrimaryModule/ModuleStatBlock/VehicleModuleStatBlock";

const supportedList = ["Available", "OnRent"];

const VehicleStatusPill = (props: { status: string }) => {
  const statusName = getVehicleStatusNameFromRaw(props.status.trim());

  return (
    <span
      className={classNames(
        "select-none rounded-full px-2.5 py-1.5 text-sm text-white",
        props.status === "Available" && "bg-green-500",
        props.status === "OnRent" && "bg-orange-500",
        // if not in supportedList
        !supportedList.includes(props.status) && "bg-slate-900"
      )}
    >
      {statusName}
    </span>
  );
};

export default VehicleStatusPill;
