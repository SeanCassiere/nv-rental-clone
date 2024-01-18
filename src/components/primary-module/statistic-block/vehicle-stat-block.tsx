import { useQuery } from "@tanstack/react-query";

import type { VehicleDataParsed } from "@/schemas/vehicle";

import { fetchVehiclesStatusesOptions } from "@/utils/query/vehicle";

import { ModuleStatBlock, ModuleStatBlockContainer } from "./common";

export const getVehicleStatusNameFromRaw = (status: string) => {
  const name = status.trim();
  if (name === "OnRent") return "On rent";
  return status;
};
const VehicleStatBlock = ({
  vehicle,
  auth: authParams,
}: {
  vehicle?: VehicleDataParsed | null;
  auth: {
    clientId: string;
    userId: string;
  };
}) => {
  const vehicleStatusList = useQuery(
    fetchVehiclesStatusesOptions({ auth: authParams })
  );

  const getStatusById = (id?: number) => {
    const find = [
      ...(vehicleStatusList.data ? vehicleStatusList.data : []),
    ].find((item) => item.id === id);
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
    <ModuleStatBlockContainer>
      <ModuleStatBlock
        header="Fleet status"
        stat={getVehicleStatusNameFromRaw(
          getStatusById(vehicle?.vehicle.statusId)
        )}
      />
      <ModuleStatBlock
        header="Vehicle type"
        stat={vehicle?.vehicle.vehicleType ?? "-"}
      />
      <ModuleStatBlock
        header="License no."
        stat={vehicle?.vehicle.licenseNo ?? "-"}
      />
      <ModuleStatBlock header="Make & model" stat={getVehicleName()} />
      <ModuleStatBlock header="Year" stat={vehicle?.vehicle.year ?? "-"} />
      <ModuleStatBlock header="Color" stat={vehicle?.vehicle.color ?? "-"} />
      <ModuleStatBlock
        header="Odometer"
        stat={vehicle?.vehicle.currentOdometer ?? "0"}
      />
      <ModuleStatBlock
        header="State"
        stat={vehicle?.vehicle.active ? "Active" : "Inactive"}
      />
    </ModuleStatBlockContainer>
  );
};

export default VehicleStatBlock;
