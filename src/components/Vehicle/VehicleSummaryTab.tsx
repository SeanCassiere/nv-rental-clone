import { useGetClientProfile } from "../../hooks/network/client/useGetClientProfile";
import { useGetVehicleData } from "../../hooks/network/vehicle/useGetVehicleData";
import { useGetVehicleSummary } from "../../hooks/network/vehicle/useGetVehicleSummary";
import { sortObject } from "../../utils/sortObject";
import { VehicleSummary } from "../PrimaryModule/ModuleSummary/VehicleSummary";

type VehicleSummaryTabProps = {
  vehicleId: string;
};

const VehicleSummaryTab = (props: VehicleSummaryTabProps) => {
  const vehicleData = useGetVehicleData({
    vehicleId: props.vehicleId,
  });

  const vehicleSummary = useGetVehicleSummary({ vehicleId: props.vehicleId });

  const clientProfile = useGetClientProfile();

  return (
    <div className="grid max-w-full grid-cols-1 gap-4 focus:ring-0 md:grid-cols-12">
      <div className="flex flex-col gap-4 md:col-span-7">
        <div className="max-h-[500px] overflow-x-scroll bg-slate-50">
          <h2>Vehicle data</h2>
          <code className="text-xs">
            <pre>{JSON.stringify(sortObject(vehicleData.data), null, 2)}</pre>
          </code>
        </div>
      </div>
      {/*  */}
      <div className="flex flex-col gap-4 md:col-span-5">
        <VehicleSummary
          summaryData={vehicleSummary.data}
          currency={clientProfile.data?.currency || undefined}
          vehicleNo={vehicleData.data?.vehicle.vehicleNo || undefined}
        />
      </div>
    </div>
  );
};

export default VehicleSummaryTab;
