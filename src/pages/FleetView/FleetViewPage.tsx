import { lazy, useMemo } from "react";
import {
  useNavigate,
  useRouter,
  useParams,
  useSearch,
  Link,
} from "@tanstack/router";
import {
  MoreVerticalIcon,
  PencilIcon,
  PrinterIcon,
  MailPlusIcon,
  CopyIcon,
  ChevronRightIcon,
  PowerOffIcon,
  PowerIcon,
} from "lucide-react";

import Protector from "@/components/Protector";
import { ChevronRightOutline, PencilIconFilled } from "@/components/icons";
import {
  type ModuleTabConfigItem,
  ModuleTabs,
} from "@/components/primary-module/ModuleTabs";
import FleetStatBlock from "@/components/primary-module/statistic-block/fleet-stat-block";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  editFleetByIdRoute,
  viewFleetByIdRoute,
} from "@/routes/fleet/fleetIdPath";

import { useGetVehicleData } from "@/hooks/network/vehicle/useGetVehicleData";
import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";

import { getStartingIndexFromTabName } from "@/utils/moduleTabs";
import { titleMaker } from "@/utils/title-maker";
import { cn } from "@/utils";
import { Separator } from "@/components/ui/separator";

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
  () => import("../../components/primary-module/ModuleNotesTabContent")
);

function VehicleViewPage() {
  const router = useRouter();
  const params = useParams();

  const { tab: tabName = "" } = useSearch({ from: viewFleetByIdRoute.id });

  const navigate = useNavigate({ from: viewFleetByIdRoute.id });

  const vehicleId = params.vehicleId || "";

  const handleFindError = () => {
    router.history.go(-1);
  };

  const onTabClick = (newTab: ModuleTabConfigItem) => {
    navigate({
      to: viewFleetByIdRoute.to,
      search: (others) => ({ ...others, tab: newTab.id }),
      params: { vehicleId },
      replace: true,
    });
  };

  const vehicle = useGetVehicleData({
    vehicleId,
    onError: handleFindError,
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
      <section
        className={cn(
          "mx-auto mt-6 flex max-w-full flex-col gap-2 px-2 pt-1.5 sm:mx-4 sm:px-1"
        )}
      >
        <div
          className={cn(
            "flex min-h-[2.5rem] flex-col items-center justify-between gap-4 sm:flex-row"
          )}
        >
          <div className="flex w-full items-center justify-start gap-2">
            <Link
              className="text-2xl font-semibold leading-6 text-primary"
              onClick={() => {
                router.history.go(-1);
              }}
            >
              Fleet
            </Link>
            <ChevronRightIcon
              className="h-4 w-4 flex-shrink-0 text-primary"
              aria-hidden="true"
            />
            <Link
              to={viewFleetByIdRoute.to}
              search={(current) => ({ tab: current?.tab || "summary" })}
              params={{ vehicleId }}
              className="max-w-[230px] truncate text-2xl font-semibold leading-6 text-primary/80 md:max-w-full"
            >
              {vehicle?.data?.vehicle.vehicleNo}
            </Link>
          </div>
          <div className="flex w-full gap-2 sm:w-max">
            <Link
              to={editFleetByIdRoute.to}
              params={{ vehicleId: String(vehicleId) }}
              className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
            >
              <PencilIcon className="mr-2 h-4 w-4" />
              <span className="inline-block">Edit</span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  type="button"
                  className="flex items-center justify-center gap-2"
                  variant="ghost"
                >
                  <MoreVerticalIcon className="mr-0.5 h-4 w-4" />
                  <span className="inline-block">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>More actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <CopyIcon className="mr-2 h-4 w-4 sm:mr-4" />
                    <span>Copy and create</span>
                  </DropdownMenuItem>
                  {vehicle.data?.vehicle.active ? (
                    <DropdownMenuItem>
                      <PowerOffIcon className="mr-2 h-4 w-4 sm:mr-4" />
                      <span>Deactivate</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>
                      <PowerIcon className="mr-2 h-4 w-4 sm:mr-4" />
                      <span>Activate</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className={cn("text-base text-primary/80")}>
          View the details related to this fleet item.
        </p>
        <Separator className="mb-3.5 mt-3.5" />
        <FleetStatBlock vehicle={vehicle.data} />
      </section>

      <section
        className={cn(
          "mx-auto my-4 flex max-w-full flex-col gap-2 px-2 sm:mx-4 sm:my-6 sm:px-1"
        )}
      >
        <ModuleTabs
          tabConfig={tabsConfig}
          startingIndex={getStartingIndexFromTabName(tabName, tabsConfig)}
          onTabClick={onTabClick}
        />
      </section>
    </Protector>
  );
}

export default VehicleViewPage;
