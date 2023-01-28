import { ModuleStatBlock, ModuleStatBlockContainer } from "./common";
import { type VehicleDataParsed } from "../../../utils/schemas/vehicle";
import { useGetVehicleStatusList } from "../../../hooks/network/vehicle/useGetVehicleStatusList";

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
        header="Status"
        stat={
          <span className="select-none text-2xl font-bold text-slate-600">
            {getStatusById(vehicle?.vehicle.statusId)}
          </span>
        }
      />
      <ModuleStatBlock
        header="Vehicle type"
        stat={
          <span className="select-none text-2xl font-bold text-slate-600">
            {vehicle?.vehicle.vehicleType ?? "-"}
          </span>
        }
      />
      <ModuleStatBlock
        header="License no."
        stat={
          <span className="select-none text-2xl font-bold text-slate-600">
            {vehicle?.vehicle.licenseNo ?? "-"}
          </span>
        }
      />
      <ModuleStatBlock
        header="Make & model"
        stat={
          <span className="select-none text-2xl font-bold text-slate-600">
            {getVehicleName()}
          </span>
        }
      />
      <ModuleStatBlock
        header="Year"
        stat={
          <span className="select-none truncate text-2xl font-bold text-slate-600">
            {vehicle?.vehicle.year ?? "-"}
          </span>
        }
      />
      <ModuleStatBlock
        header="Color"
        stat={
          <span className="select-none text-2xl font-bold text-slate-600">
            {vehicle?.vehicle.color ?? "-"}
          </span>
        }
      />
      <ModuleStatBlock
        header="Odometer"
        stat={
          <span className="select-none text-2xl font-bold text-slate-600">
            {vehicle?.vehicle.currentOdometer ?? "0"}
          </span>
        }
      />
      <ModuleStatBlock
        header="In fleet?"
        stat={
          <span className="select-none text-2xl font-bold text-slate-600">
            {vehicle?.vehicle.active ? "Online" : "Offline"}
          </span>
        }
      />
    </ModuleStatBlockContainer>
  );
};

export default VehicleModuleStatBlock;
