import { lazy, useEffect, useMemo } from "react";
import {
  useNavigate,
  useRouter,
  useParams,
  useSearch,
  Link,
} from "@tanstack/react-router";

import { viewVehicleRoute } from "../../routes/vehicles/viewVehicle";
import Protector from "../../components/Protector";
import { ChevronRightOutline } from "../../components/icons";
import { useGetVehicleData } from "../../hooks/network/vehicle/useGetVehicleData";
import {
  type ModuleTabConfigItem,
  ModuleTabs,
} from "../../components/PrimaryModule/ModuleTabs";
import ScrollToTop from "../../components/ScrollToTop";

import { getStartingIndexFromTabName } from "../../utils/moduleTabs";
import { titleMaker } from "../../utils/title-maker";

const SummaryTab = lazy(
  () => import("../../components/Vehicle/VehicleSummaryTab")
);
const VehicleReservationsTab = lazy(
  () => import("../../components/Vehicle/VehicleReservationsTab")
);
const VehicleAgreementsTab = lazy(
  () => import("../../components/Vehicle/VehicleAgreementsTab")
);

function VehicleViewPage() {
  const router = useRouter();
  const params = useParams();

  const { tab: tabName = "" } = useSearch({ from: viewVehicleRoute.id });

  const navigate = useNavigate({ from: viewVehicleRoute.id });

  const vehicleId = params.vehicleId || "";

  const onFindError = () => {
    router.history.go(-1);
  };

  const onTabClick = (newTab: ModuleTabConfigItem) => {
    navigate({
      to: viewVehicleRoute.id,
      search: (others) => ({ ...others, tab: newTab.id }),
      replace: true,
    });
  };

  const vehicle = useGetVehicleData({
    vehicleId,
    onError: onFindError,
  });

  const tabsConfig: ModuleTabConfigItem[] = useMemo(() => {
    const tabs: ModuleTabConfigItem[] = [];

    tabs.push({
      id: "summary",
      label: "Summary",
      component: <SummaryTab vehicleId={vehicleId} />,
    });
    tabs.push({
      id: "notes",
      label: "Notes",
      component: "Notes Tab",
    });
    tabs.push({
      id: "documents",
      label: "Documents",
      component: "Documents Tab",
    });
    tabs.push({
      id: "reservations",
      label: "Reservations",
      component: (
        <VehicleReservationsTab
          vehicleId={vehicleId}
          vehicleNo={vehicle.data?.vehicle.vehicleNo || ""}
        />
      ),
    });
    tabs.push({
      id: "agreements",
      label: "Agreements",
      component: (
        <VehicleAgreementsTab
          vehicleId={vehicleId}
          vehicleNo={vehicle.data?.vehicle.vehicleNo || ""}
        />
      ),
    });

    return tabs;
  }, [vehicleId, vehicle.data]);

  useEffect(() => {
    document.title = titleMaker(
      (vehicle.data?.vehicle.vehicleNo || "Loading") + " - Vehicles"
    );
  }, [vehicle.data?.vehicle.vehicleNo]);

  return (
    <Protector>
      <ScrollToTop />
      <div className="py-6">
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <div className="flex w-full flex-col justify-between md:flex-row md:items-center">
            <nav className="flex grow items-center" aria-label="Breadcrumb">
              <ol className="flex items-end space-x-2">
                <li>
                  <div className="flex">
                    <Link
                      to=".."
                      className="text-2xl font-semibold leading-tight tracking-tight text-gray-700 hover:text-gray-800"
                      onClick={() => {
                        router.history.go(-1);
                      }}
                    >
                      Vehicles
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightOutline
                      className="h-3.5 w-3.5 flex-shrink-0 text-gray-500"
                      aria-hidden="true"
                    />
                    <Link
                      to={viewVehicleRoute.id}
                      params={{ vehicleId }}
                      search={(current) => ({ tab: current?.tab || "summary" })}
                      className="max-w-[230px] truncate pl-2 text-xl text-gray-900 md:max-w-full"
                    >
                      {vehicle?.data?.vehicle.vehicleNo}
                    </Link>
                  </div>
                </li>
              </ol>
            </nav>
            {/*  */}
          </div>
          <div className="mt-6 bg-slate-50 p-4">Vehicle information modes</div>
        </div>

        <div className="mx-auto px-4 sm:px-6 md:grid-cols-12 md:px-8">
          <ModuleTabs
            tabConfig={tabsConfig}
            startingIndex={getStartingIndexFromTabName(tabName, tabsConfig)}
            onTabClick={onTabClick}
          />
        </div>
      </div>
    </Protector>
  );
}

export default VehicleViewPage;
