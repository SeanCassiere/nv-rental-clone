import { lazy, useMemo } from "react";
import {
  useNavigate,
  useRouter,
  useParams,
  useSearch,
  Link,
} from "@tanstack/react-router";

import Protector from "../../components/Protector";
import { ChevronRightOutline } from "../../components/icons";
import {
  type ModuleTabConfigItem,
  ModuleTabs,
} from "../../components/PrimaryModule/ModuleTabs";
import ScrollToTop from "../../components/ScrollToTop";
import VehicleModuleStatBlock from "../../components/PrimaryModule/ModuleStatBlock/VehicleModuleStatBlock";
import CommonHeader from "../../components/Layout/CommonHeader";

import { viewFleetByIdRoute } from "../../routes/fleet/fleetIdPath";

import { useGetVehicleData } from "../../hooks/network/vehicle/useGetVehicleData";
import { useDocumentTitle } from "../../hooks/internal/useDocumentTitle";

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

const ModuleNotesTabContent = lazy(
  () => import("../../components/PrimaryModule/ModuleNotesTabContent")
);

function VehicleViewPage() {
  const router = useRouter();
  const params = useParams();

  const { tab: tabName = "" } = useSearch({ from: viewFleetByIdRoute.id });

  const navigate = useNavigate({ from: viewFleetByIdRoute.id });

  const vehicleId = params.vehicleId || "";

  const onFindError = () => {
    router.history.go(-1);
  };

  const onTabClick = (newTab: ModuleTabConfigItem) => {
    navigate({
      to: viewFleetByIdRoute.fullPath,
      search: (others) => ({ ...others, tab: newTab.id }),
      params: { vehicleId },
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
      component: (
        <ModuleNotesTabContent module="vehicles" referenceId={vehicleId} />
      ),
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

  useDocumentTitle(
    titleMaker((vehicle.data?.vehicle.vehicleNo || "Loading") + " - Fleet")
  );

  return (
    <Protector>
      <ScrollToTop />
      <div className="py-6">
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <CommonHeader
            titleContent={
              <div className="flex items-center gap-2">
                <Link
                  to=".."
                  className="select-none text-2xl font-semibold leading-6 text-gray-700 hover:text-gray-800"
                  onClick={() => {
                    router.history.go(-1);
                  }}
                >
                  Fleet
                </Link>
                <ChevronRightOutline
                  className="h-4 w-4 flex-shrink-0 text-gray-500"
                  aria-hidden="true"
                />
                <Link
                  to={viewFleetByIdRoute.fullPath}
                  search={(current) => ({ tab: current?.tab || "summary" })}
                  params={{ vehicleId }}
                  className="max-w-[230px] truncate text-xl leading-6 text-gray-800 md:max-w-full"
                >
                  {vehicle?.data?.vehicle.vehicleNo}
                </Link>
              </div>
            }
            headerActionContent
          />
          <div className="my-4 mt-2 sm:mt-6">
            <VehicleModuleStatBlock vehicle={vehicle.data} />
          </div>
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
