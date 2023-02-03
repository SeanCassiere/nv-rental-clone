import { ModuleStatBlock, ModuleStatBlockContainer } from "./common";
import { type VehicleDataParsed } from "../../../utils/schemas/vehicle";
import { useGetVehicleStatusList } from "../../../hooks/network/vehicle/useGetVehicleStatusList";
import classNames from "classnames";

const VehicleModuleStatBlock = ({
  vehicle,
}: {
  vehicle?: VehicleDataParsed | null;
}) => {
  const vehicleStatusList = useGetVehicleStatusList();

  const getStatusById = (id?: number) => {
    const find = vehicleStatusList.data.find((item) => item.id === id);
    if (find) {
      return find.name;
    }
    return "-";
  };

  const getVehicleName = () => {
    if (!vehicle?.vehicle.vehicleMakeName && !vehicle?.vehicle.modelName) {
      return "-";
    }
    return `${vehicle?.vehicle.vehicleMakeName} ${vehicle?.vehicle.modelName}`;
  };
  return (
    <ModuleStatBlockContainer
      title="Overview"
      subtitle="See what's going on with this vehicle."
    >
      <ModuleStatBlock
        header="Fleet status"
        stat={
          <span className="select-none text-xl font-semibold text-slate-600 xl:text-2xl">
            {getStatusById(vehicle?.vehicle.statusId)}
          </span>
        }
      />
      <ModuleStatBlock
        header="Vehicle type"
        stat={
          <span className="select-none text-xl font-semibold text-slate-600 xl:text-2xl">
            {vehicle?.vehicle.vehicleType ?? "-"}
          </span>
        }
      />
      <ModuleStatBlock
        header="License no."
        stat={
          <span className="select-none text-xl font-semibold text-slate-600 xl:text-2xl">
            {vehicle?.vehicle.licenseNo ?? "-"}
          </span>
        }
      />
      <ModuleStatBlock
        header="Make & model"
        stat={
          <span className="select-none text-xl font-semibold text-slate-600 xl:text-2xl">
            {getVehicleName()}
          </span>
        }
      />
      <ModuleStatBlock
        header="Year"
        stat={
          <span className="select-none truncate text-xl font-semibold text-slate-600 xl:text-2xl">
            {vehicle?.vehicle.year ?? "-"}
          </span>
        }
      />
      <ModuleStatBlock
        header="Color"
        stat={
          <span className="select-none text-xl font-semibold text-slate-600 xl:text-2xl">
            {vehicle?.vehicle.color ?? "-"}
          </span>
        }
      />
      <ModuleStatBlock
        header="Odometer"
        stat={
          <span className="select-none text-xl font-semibold text-slate-600 xl:text-2xl">
            {vehicle?.vehicle.currentOdometer ?? "0"}
          </span>
        }
      />
      <ModuleStatBlock
        header="State"
        stat={
          <span
            className={classNames(
              "select-none text-xl font-semibold xl:text-2xl",
              vehicle?.vehicle.active ? "text-slate-600" : "text-red-500"
            )}
          >
            {vehicle?.vehicle.active ? "Active" : "Inactive"}
          </span>
        }
      />
    </ModuleStatBlockContainer>
  );
};

export default VehicleModuleStatBlock;
