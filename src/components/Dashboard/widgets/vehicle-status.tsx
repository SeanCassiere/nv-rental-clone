import { Link } from "@tanstack/router";

import { useGetDashboardVehicleStatusCounts } from "@/hooks/network/dashboard/useGetDashboardVehicleStatusCounts";
import { useGetVehicleStatusList } from "@/hooks/network/vehicle/useGetVehicleStatusList";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VehicleStatusWidget = ({
  currentLocations: locations,
}: {
  currentLocations: string[];
}) => {
  const vehicleTypeId = 0;
  const statusCounts = useGetDashboardVehicleStatusCounts({
    locationIds: locations,
    vehicleType: vehicleTypeId,
    clientDate: new Date(),
  });

  const vehicleStatuses = useGetVehicleStatusList();

  const getStatusIdByName = (name: string) => {
    const status = vehicleStatuses.data?.find((s) => s.name === name);
    return status?.id || 0;
  };

  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Vehicle Status</CardTitle>
      </CardHeader>
      <CardContent>
        {statusCounts.data.map((status) => (
          <Link
            key={`status-${status.name}`}
            className="block"
            to="/fleet"
            search={() =>
              ({
                filters: {
                  Active: true,
                  VehicleStatus: getStatusIdByName(status.name).toString(),
                  ...(vehicleTypeId > 0
                    ? { VehicleTypeId: vehicleTypeId }
                    : {}),
                },
              }) as any
            }
          >
            {status.name}
            &nbsp;-&nbsp;
            {status.total.toString()}
          </Link>
        ))}
      </CardContent>
    </>
  );
};

export default VehicleStatusWidget;
