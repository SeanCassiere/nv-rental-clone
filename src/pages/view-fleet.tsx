import { lazy, Suspense, useEffect, useMemo, type ReactNode } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useRouter,
  useSearch,
} from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

import { LoadingPlaceholder } from "@/components/loading-placeholder";
import FleetStatBlock from "@/components/primary-module/statistic-block/fleet-stat-block";
import ProtectorShield from "@/components/protector-shield";
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
import { icons } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";
import { useGetVehicleData } from "@/hooks/network/vehicle/useGetVehicleData";

import { viewFleetByIdRoute } from "@/routes/fleet/fleet-id-route";

import { titleMaker } from "@/utils/title-maker";

import { cn } from "@/utils";

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
  const params = useParams({ from: viewFleetByIdRoute.id });

  const auth = useAuth();

  const { tab: tabName = "" } = useSearch({ from: viewFleetByIdRoute.id });

  const clientId = auth?.user?.profile?.navotar_clientid || "";
  const userId = auth?.user?.profile?.navotar_userid || "";

  const navigate = useNavigate();

  const vehicleId = params.vehicleId || "";

  const onTabClick = (newTabId: string) => {
    navigate({
      to: "/fleet/$vehicleId",
      search: (others) => ({ ...others, tab: newTabId }),
      params: { vehicleId },
      replace: true,
    });
  };

  const vehicleData = useGetVehicleData({
    vehicleId,
  });
  const vehicle =
    vehicleData.data?.status === 200 ? vehicleData.data.body : null;

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
        <ModuleNotesTabContent
          module="vehicles"
          referenceId={vehicleId}
          clientId={clientId}
          userId={userId}
        />
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
          vehicleNo={vehicle?.vehicle.vehicleNo || ""}
        />
      ),
    });
    tabs.push({
      id: "agreements",
      label: "Agreements",
      component: (
        <FleetAgreementsTab
          vehicleId={vehicleId}
          vehicleNo={vehicle?.vehicle.vehicleNo || ""}
        />
      ),
    });

    return tabs;
  }, [vehicleId, vehicle, clientId, userId]);

  useDocumentTitle(
    titleMaker((vehicle?.vehicle.vehicleNo || "Loading") + " - Fleet")
  );

  useEffect(() => {
    if (vehicleData.status !== "error") return;

    router.history.go(-1);
  }, [router.history, vehicleData.status]);

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
            <Link to=".." className="text-2xl font-semibold leading-6">
              Fleet
            </Link>
            <icons.ChevronRight
              className="h-4 w-4 flex-shrink-0"
              aria-hidden="true"
            />
            <Link
              to="/fleet/$vehicleId"
              search={(current) => ({
                tab:
                  "tab" in current && typeof current.tab === "string"
                    ? current.tab
                    : "summary",
              })}
              params={{ vehicleId }}
              className="max-w-[230px] truncate text-2xl font-semibold leading-6 text-foreground/80 md:max-w-full"
            >
              {vehicle?.vehicle.vehicleNo}
            </Link>
          </div>
          <div className="flex w-full gap-2 sm:w-max">
            <Link
              to="/fleet/$vehicleId/edit"
              params={{ vehicleId: String(vehicleId) }}
              className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
            >
              <icons.Edit className="mr-2 h-4 w-4" />
              <span className="inline-block">Edit</span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  type="button"
                  className="flex items-center justify-center gap-2"
                  variant="outline"
                >
                  <icons.More className="h-4 w-4" />
                  <span className="sr-only inline-block">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>More actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <icons.Copy className="mr-2 h-4 w-4 sm:mr-4" />
                    <span>Copy and create</span>
                  </DropdownMenuItem>
                  {vehicle?.vehicle.active ? (
                    <DropdownMenuItem>
                      <icons.Deactivate className="mr-2 h-4 w-4 sm:mr-4" />
                      <span>Deactivate</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>
                      <icons.Activate className="mr-2 h-4 w-4 sm:mr-4" />
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
        <FleetStatBlock vehicle={vehicle} />
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
