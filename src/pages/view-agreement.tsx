import { lazy, Suspense, useEffect, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, RouteApi, useNavigate, useRouter } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

import { LoadingPlaceholder } from "@/components/loading-placeholder";
import AgreementStatBlock from "@/components/primary-module/statistic-block/agreement-stat-block";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";

import { getAuthFromAuthHook } from "@/utils/auth";
import { titleMaker } from "@/utils/title-maker";

import { cn } from "@/utils";

const SummaryTab = lazy(
  () => import("../components/primary-module/tabs/agreement/summary-content")
);
const ModuleNotesTabContent = lazy(
  () => import("../components/primary-module/tabs/notes-content")
);
const AgreementExchangesTab = lazy(
  () => import("../components/primary-module/tabs/agreement/exchanges-content")
);

const routeApi = new RouteApi({ id: "/agreements/$agreementId" });

type TabListItem = {
  id: string;
  label: string;
  component: ReactNode;
  preloadFn?: () => void;
  suspenseComponent?: ReactNode;
};

function AgreementViewPage() {
  const router = useRouter();
  const auth = useAuth();
  const authParams = getAuthFromAuthHook(auth);

  const navigate = useNavigate();

  const routeContext = routeApi.useRouteContext();
  const { agreementId } = routeApi.useParams();
  const { tab: tabName = "summary" } = routeApi.useSearch();

  const tabsConfig = useMemo(() => {
    const tabs: TabListItem[] = [];

    tabs.push({
      id: "summary",
      label: "Summary",
      component: <SummaryTab agreementId={agreementId} auth={authParams} />,
      suspenseComponent: <LoadingPlaceholder />,
    });
    tabs.push({
      id: "notes",
      label: "Notes",
      component: (
        <ModuleNotesTabContent
          module="agreements"
          referenceId={agreementId}
          clientId={authParams.clientId}
          userId={authParams.userId}
        />
      ),
      preloadFn: () =>
        router.preloadRoute({
          to: "/agreements/$agreementId",
          params: {
            agreementId,
          },
          search: (current) => ({
            ...current,
            tab: "notes",
          }),
        }),
    });
    tabs.push({
      id: "payments",
      label: "Payments",
      component: "Payments Tab",
      preloadFn: () =>
        router.preloadRoute({
          to: "/agreements/$agreementId",
          params: {
            agreementId,
          },
          search: (current) => ({
            ...current,
            tab: "payments",
          }),
        }),
    });
    tabs.push({
      id: "invoices",
      label: "Invoices",
      component: "Invoices Tab",
      preloadFn: () =>
        router.preloadRoute({
          to: "/agreements/$agreementId",
          params: {
            agreementId,
          },
          search: (current) => ({
            ...current,
            tab: "invoices",
          }),
        }),
    });
    tabs.push({
      id: "documents",
      label: "Documents",
      component: "Documents Tab",
      preloadFn: () =>
        router.preloadRoute({
          to: "/agreements/$agreementId",
          params: {
            agreementId,
          },
          search: (current) => ({
            ...current,
            tab: "documents",
          }),
        }),
    });
    tabs.push({
      id: "charges",
      label: "Charges",
      component: "Charges Tab",
      preloadFn: () =>
        router.preloadRoute({
          to: "/agreements/$agreementId",
          params: {
            agreementId,
          },
          search: (current) => ({
            ...current,
            tab: "charges",
          }),
        }),
    });
    tabs.push({
      id: "exchanges",
      label: "Exchanges",
      component: <AgreementExchangesTab />,
      preloadFn: () =>
        router.preloadRoute({
          to: "/agreements/$agreementId",
          params: {
            agreementId,
          },
          search: (current) => ({
            ...current,
            tab: "exchanges",
          }),
        }),
    });
    return tabs;
  }, [router, agreementId, authParams]);

  const onTabClick = (newTabId: string) => {
    navigate({
      to: "/agreements/$agreementId",
      search: (others) => ({ ...others, tab: newTabId }),
      params: { agreementId },
      replace: true,
    });
  };

  const agreementQuery = useQuery(routeContext.viewAgreementOptions);
  const agreement =
    agreementQuery.data?.status === 200 ? agreementQuery.data.body : null;
  const isCheckedIn = agreement?.returnDate ? true : false;

  useDocumentTitle(
    titleMaker((agreement?.agreementNumber || "Loading") + " - Agreements")
  );

  useEffect(() => {
    if (agreementQuery.status !== "error") return;

    router.history.go(-1);
  }, [agreementQuery.status, router.history]);

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
              Agreements
            </Link>
            <icons.ChevronRight
              className="h-4 w-4 flex-shrink-0"
              aria-hidden="true"
            />
            <Link
              to="/agreements/$agreementId"
              search={(current) => ({
                tab:
                  "tab" in current && typeof current.tab === "string"
                    ? current.tab
                    : "summary",
              })}
              params={{ agreementId }}
              className="max-w-[230px] truncate text-2xl font-semibold leading-6 text-foreground/80 md:max-w-full"
            >
              {agreement?.agreementNumber}
            </Link>
          </div>
          <div className="flex w-full gap-2 sm:w-max">
            {!isCheckedIn && (
              <Link
                to="/agreements/$agreementId/check-in"
                search={() => ({ stage: "rental-information" })}
                params={{ agreementId: String(agreementId) }}
                className={cn(buttonVariants({ size: "sm" }))}
              >
                <icons.Checkin className="mr-2 h-4 w-4" />
                <span className="inline-block">Checkin</span>
              </Link>
            )}
            {isCheckedIn ? (
              <Link
                to="/agreements/$agreementId/check-in"
                search={() => ({ stage: "rental-information" })}
                params={{ agreementId: String(agreementId) }}
                className={cn(
                  buttonVariants({ size: "sm", variant: "outline" })
                )}
              >
                <icons.Edit className="mr-2 h-4 w-4" />
                <span className="inline-block">Edit</span>
              </Link>
            ) : (
              <Link
                to="/agreements/$agreementId/edit"
                search={() => ({ stage: "rental-information" })}
                params={{ agreementId: String(agreementId) }}
                className={cn(
                  buttonVariants({ size: "sm", variant: "outline" })
                )}
              >
                <icons.Edit className="mr-2 h-4 w-4" />
                <span className="inline-block">Edit</span>
              </Link>
            )}
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
                    <icons.Print className="mr-2 h-4 w-4 sm:mr-4" />
                    <span>Print</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <icons.MailPlus className="mr-2 h-4 w-4 sm:mr-4" />
                    <span>Email</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <icons.Clear className="mr-2 h-4 w-4 sm:mr-4" />
                    <span>Void</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className={cn("text-base text-foreground/80")}>
          View the details related to this rental.
        </p>
        <Separator className="mb-3.5 mt-3.5" />
        <AgreementStatBlock agreement={agreement} isCheckedIn={isCheckedIn} />
      </section>

      <section
        className={cn(
          "mx-auto my-4 flex max-w-full flex-col gap-2 px-2 sm:mx-4 sm:my-6 sm:px-1"
        )}
      >
        <Tabs value={tabName} onValueChange={onTabClick}>
          <TabsList className="w-full sm:max-w-max">
            {tabsConfig.map((tab, idx) => (
              <TabsTrigger
                key={`tab-trigger-${idx}`}
                value={tab.id}
                onMouseEnter={tab?.preloadFn}
                onTouchStart={tab?.preloadFn}
              >
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
              <Suspense
                fallback={
                  tab?.suspenseComponent || <Skeleton className="h-[450px]" />
                }
              >
                {tab.component}
              </Suspense>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </ProtectorShield>
  );
}

export default AgreementViewPage;
