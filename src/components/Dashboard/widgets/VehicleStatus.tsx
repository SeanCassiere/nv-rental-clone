import { Link } from "@tanstack/react-router";

import { searchFleetRoute } from "../../../routes/fleet/searchFleet";
import { useGetDashboardVehicleStatusCounts } from "../../../hooks/network/dashboard/useGetDashboardVehicleStatusCounts";
import { useGetVehicleStatusList } from "../../../hooks/network/vehicle/useGetVehicleStatusList";
import type { StringNumberIdType } from "../../../utils/query-key";

const VehicleStatusWidget = ({
  currentLocations,
}: {
  currentLocations: StringNumberIdType[];
}) => {
  const vehicleTypeId = 0;
  const statusCounts = useGetDashboardVehicleStatusCounts({
    locationIds: currentLocations,
    vehicleType: vehicleTypeId,
    clientDate: new Date(),
  });

  const vehicleStatuses = useGetVehicleStatusList();

  const getStatusIdByName = (name: string) => {
    const status = vehicleStatuses.data?.find((s) => s.name === name);
    return status?.id || 0;
  };

  return (
    <div className="h-full w-full px-4 py-2">
      <div className="text-base font-semibold text-slate-700">
        Vehicle Status
      </div>
      <div>
        {statusCounts.data.map((status) => (
          <Link
            key={`status-${status.name}`}
            className="block"
            to={searchFleetRoute.fullPath}
            search={() => ({
              filters: {
                Active: true,
                VehicleStatus: getStatusIdByName(status.name).toString(),
                ...(vehicleTypeId > 0 ? { VehicleTypeId: vehicleTypeId } : {}),
              },
            })}
          >
            {status.name}
            &nbsp;-&nbsp;
            {status.total.toString()}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VehicleStatusWidget;
