import { lazy } from "react";
import {
  useNavigate,
  useRouter,
  useParams,
  useSearch,
  Link,
} from "@tanstack/react-router";

import { viewVehicleRoute } from "../../routes/vehicles/viewVehicle";
import Protector from "../../components/Protector";
import {
  ChevronRightOutline,
  HamburgerMenuOutline,
} from "../../components/icons";
import { useGetVehicleData } from "../../hooks/network/vehicle/useGetVehicleData";
import {
  type ModuleTabConfigItem,
  ModuleTabs,
} from "../../components/PrimaryModule/ModuleTabs";
import ScrollToTop from "../../components/ScrollToTop";

import { getStartingIndexFromTabName } from "../../utils/moduleTabs";

const SummaryTab = lazy(
  () => import("../../components/Vehicle/VehicleSummaryTab")
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

  const onTabClick = (newTabName: string) => {
    navigate({
      to: viewVehicleRoute.id,
      search: (others) => ({ ...others, tab: newTabName }),
      replace: true,
    });
  };

  const tabsConfig: ModuleTabConfigItem[] = [
    {
      id: "summary",
      label: "Summary",
      component: <SummaryTab vehicleId={vehicleId} />,
    },
  ];

  const vehicle = useGetVehicleData({
    vehicleId,
    onError: onFindError,
  });

  return (
    <Protector>
      <ScrollToTop />
      <div className="py-6">
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <div className="flex w-full flex-col justify-between gap-4 md:flex-row md:items-center md:gap-8">
            <nav className="flex grow items-center" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <div className="flex">
                    <Link
                      to=".."
                      className="text-2xl font-semibold text-gray-600 hover:text-gray-800"
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
                      className="h-5 w-5 flex-shrink-0 text-gray-500"
                      aria-hidden="true"
                    />
                    <Link
                      to={viewVehicleRoute.id}
                      params={{ vehicleId }}
                      className="pl-2 text-2xl text-gray-900"
                    >
                      {vehicle?.data?.vehicle.vehicleNo}
                    </Link>
                  </div>
                </li>
              </ol>
            </nav>
            {/*  */}
            <div className="flex flex-row items-center justify-end gap-4 md:gap-8">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 font-semibold shadow"
              >
                <HamburgerMenuOutline className="h-7 w-7" />
                <span className="sr-only">Options</span>
              </button>
            </div>
          </div>
          <div className="mt-6 bg-white p-4">Vehicle information modes</div>
        </div>

        <div className="mx-auto px-4 sm:px-6 md:grid-cols-12 md:px-8">
          <ModuleTabs
            key={`changing-tab-${tabName}`}
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
