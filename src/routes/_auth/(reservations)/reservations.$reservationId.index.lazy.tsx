import { lazy, Suspense, useEffect, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  createLazyFileRoute,
  getRouteApi,
  Link,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

import { LoadingPlaceholder } from "@/components/loading-placeholder";
import ReservationStatBlock from "@/components/primary-module/statistic-block/reservation-stat-block";
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

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { Container } from "@/routes/-components/container";

import { getAuthFromAuthHook } from "@/lib/utils/auth";
import { titleMaker } from "@/lib/utils/title-maker";

import { cn } from "@/lib/utils";

const SummaryTab = lazy(
  () => import("@/components/primary-module/tabs/reservation/summary-content")
);
const ModuleNotesTabContent = lazy(
  () => import("@/components/primary-module/tabs/notes-content")
);

export const Route = createLazyFileRoute(
  "/_auth/(reservations)/reservations/$reservationId/"
)({
  component: ReservationViewPage,
});

const routeApi = getRouteApi("/_auth/reservations/$reservationId/");

function ReservationViewPage() {
  const router = useRouter();

  const auth = useAuth();
  const authParams = getAuthFromAuthHook(auth);

  const routeContext = routeApi.useRouteContext();
  const { tab: tabName = "summary" } = routeApi.useSearch();
  const { reservationId } = routeApi.useParams();

  const navigate = useNavigate();

  const tabsConfig = useMemo(() => {
    const tabs: { id: string; label: string; component: ReactNode }[] = [];

    tabs.push({
      id: "summary",
      label: "Summary",
      component: <SummaryTab reservationId={reservationId} auth={authParams} />,
    });
    tabs.push({
      id: "notes",
      label: "Notes",
      component: (
        <ModuleNotesTabContent
          module="reservations"
          referenceId={reservationId}
          clientId={authParams.clientId}
          userId={authParams.userId}
        />
      ),
    });
    tabs.push({
      id: "payments",
      label: "Payments",
      component: "Payments Tab",
    });
    tabs.push({
      id: "invoices",
      label: "Invoices",
      component: "Invoices Tab",
    });

    return tabs;
  }, [reservationId, authParams]);

  const onTabClick = (newTabId: string) => {
    navigate({
      to: "/reservations/$reservationId",
      search: (others) => ({ ...others, tab: newTabId }),
      params: { reservationId },
      replace: true,
    });
  };

  const reservationData = useQuery(routeContext.viewReservationOptions);
  const reservation =
    reservationData.data?.status === 200 ? reservationData.data?.body : null;

  useDocumentTitle(
    titleMaker(
      (reservation?.reservationview.reservationNumber || "Loading") +
        " - Reservations"
    )
  );

  useEffect(() => {
    if (reservationData.status !== "error") return;

    router.history.go(-1);
  }, [reservationData.status, router.history]);

  return (
    <Container>
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
              from="/reservations/$reservationId"
              to=".."
              className="text-2xl font-semibold leading-6"
            >
              Reservations
            </Link>
            <icons.ChevronRight
              className="h-4 w-4 flex-shrink-0"
              aria-hidden="true"
            />
            <Link
              to="/reservations/$reservationId"
              search={(current) => ({
                tab:
                  "tab" in current && typeof current.tab === "string"
                    ? current.tab
                    : "summary",
              })}
              params={{ reservationId }}
              className="max-w-[230px] truncate text-2xl font-semibold leading-6 text-foreground/80 md:max-w-full"
            >
              {reservation?.reservationview?.reservationNumber}
            </Link>
          </div>
          <div className="flex w-full gap-2 sm:w-max">
            <Link
              to="/reservations/$reservationId/edit"
              search={() => ({ stage: "rental-information" })}
              params={{ reservationId: String(reservationId) }}
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
                  <DropdownMenuItem>
                    <icons.Print className="mr-2 h-4 w-4 sm:mr-4" />
                    <span>Print</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <icons.MailPlus className="mr-2 h-4 w-4 sm:mr-4" />
                    <span>Email</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className={cn("text-base text-foreground/80")}>
          View the details related to this booking.
        </p>
        <Separator className="mb-3.5 mt-3.5" />
        <ReservationStatBlock reservation={reservation} />
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
    </Container>
  );
}
