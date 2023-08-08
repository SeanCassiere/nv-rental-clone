import { lazy, useMemo, Suspense, type ReactNode, useEffect } from "react";
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
  CopyIcon,
  ChevronRightIcon,
  PowerOffIcon,
  PowerIcon,
} from "lucide-react";

import ProtectorShield from "@/components/protector-shield";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingPlaceholder from "@/components/loading-placeholder";

import {
  editFleetByIdRoute,
  viewFleetByIdRoute,
} from "@/routes/fleet/fleet-id-route";

import { useGetVehicleData } from "@/hooks/network/vehicle/useGetVehicleData";
import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";

import { titleMaker } from "@/utils/title-maker";
import { cn } from "@/utils";
import { Separator } from "@/components/ui/separator";

const FleetSummaryTab = lazy(
  () => import("../components/primary-module/tabs/fleet/summary-content")
);
const FleetReservationsTab = lazy(
  () =>
    import(
      "../components/primary-module/tabs/fleet/occupied-reservations-content"
    )
);
const FleetAgreementsTab = lazy(
  () =>
    import(
      "../components/primary-module/tabs/fleet/occupied-agreements-content"
    )
);

const ModuleNotesTabContent = lazy(
  () => import("../components/primary-module/tabs/notes-content")
);

function VehicleViewPage() {
  const router = useRouter();
  const params = useParams();

  const { tab: tabName = "" } = useSearch({ from: viewFleetByIdRoute.id });

  const navigate = useNavigate();

  const vehicleId = params.vehicleId || "";

  const onTabClick = (newTabId: string) => {
    navigate({
      to: viewFleetByIdRoute.to,
      search: (others) => ({ ...others, tab: newTabId }),
      params: { vehicleId },
      replace: true,
    });
  };

  const vehicle = useGetVehicleData({
    vehicleId,
  });

  const tabsConfig = useMemo(() => {
    const tabs: { id: string; label: string; component: ReactNode }[] = [];

    tabs.push({
      id: "summary",
      label: "Summary",
      component: <FleetSummaryTab vehicleId={vehicleId} />,
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
        <FleetReservationsTab
          vehicleId={vehicleId}
          vehicleNo={vehicle.data?.vehicle.vehicleNo || ""}
        />
      ),
    });
    tabs.push({
      id: "agreements",
      label: "Agreements",
      component: (
        <FleetAgreementsTab
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

  useEffect(() => {
    if (vehicle.status !== "error") return;

    router.history.go(-1);
  }, [router.history, vehicle.status]);

  return (
    <ProtectorShield>
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
              className="text-2xl font-semibold leading-6"
              onClick={() => {
                router.history.go(-1);
              }}
            >
              Fleet
            </Link>
            <ChevronRightIcon
              className="h-4 w-4 flex-shrink-0"
              aria-hidden="true"
            />
            <Link
              to={viewFleetByIdRoute.to}
              search={(current) => ({ tab: current?.tab || "summary" })}
              params={{ vehicleId }}
              className="max-w-[230px] truncate text-2xl font-semibold leading-6 text-foreground/80 md:max-w-full"
            >
              {vehicle?.data?.vehicle.vehicleNo}
            </Link>
          </div>
          <div className="flex w-full gap-2 sm:w-max">
            <Link
              to={editFleetByIdRoute.to}
              params={{ vehicleId: String(vehicleId) }}
              className={cn(
                buttonVariants({ size: "sm", variant: "secondary" })
              )}
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
                  variant="secondary"
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
        <p className={cn("text-base text-foreground/80")}>
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
        <Tabs value={tabName} onValueChange={onTabClick}>
          <TabsList className="w-full sm:max-w-max">
            {tabsConfig.map((tab, idx) => (
              <TabsTrigger key={`tab-trigger-${idx}`} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabsConfig.map((tab, idx) => (
            <TabsContent
              key={`tab-content-${idx}`}
              value={tab.id}
              className="min-h-[250px]"
            >
              <Suspense fallback={<LoadingPlaceholder />}>
                {tab.component}
              </Suspense>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </ProtectorShield>
  );
}

export default VehicleViewPage;
