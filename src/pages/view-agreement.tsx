import { lazy, Suspense, useEffect, useMemo, type ReactNode } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useRouter,
  useSearch,
} from "@tanstack/react-router";
import {
  BanIcon,
  ChevronRightIcon,
  MailPlusIcon,
  MoreVerticalIcon,
  MoveDownLeftIcon,
  PencilIcon,
  PrinterIcon,
} from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";
import { useGetAgreementData } from "@/hooks/network/agreement/useGetAgreementData";

import { viewAgreementByIdRoute } from "@/routes/agreements/agreement-id-route";

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

function AgreementViewPage() {
  const router = useRouter();
  const auth = useAuth();

  const clientId = auth?.user?.profile?.navotar_clientid || "";
  const userId = auth?.user?.profile?.navotar_userid || "";

  const { tab: tabName = "summary" } = useSearch({
    from: viewAgreementByIdRoute.id,
  });

  const navigate = useNavigate();

  const params = useParams({
    from: viewAgreementByIdRoute.id,
  });

  const agreementId = params.agreementId || "";

  const tabsConfig = useMemo(() => {
    const tabs: {
      id: string;
      label: string;
      component: ReactNode;
      preloadFn?: () => void;
    }[] = [];

    tabs.push({
      id: "summary",
      label: "Summary",
      component: <SummaryTab agreementId={agreementId} />,
    });
    tabs.push({
      id: "notes",
      label: "Notes",
      component: (
        <ModuleNotesTabContent module="agreements" referenceId={agreementId} />
      ),
      preloadFn: () =>
        router.preloadRoute({
          to: viewAgreementByIdRoute.id,
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
          to: viewAgreementByIdRoute.id,
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
          to: viewAgreementByIdRoute.id,
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
          to: viewAgreementByIdRoute.id,
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
          to: viewAgreementByIdRoute.id,
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
      component: (
        <AgreementExchangesTab
          referenceId={agreementId}
          clientId={clientId}
          userId={userId}
        />
      ),
      preloadFn: () =>
        router.preloadRoute({
          to: viewAgreementByIdRoute.id,
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
  }, [router, agreementId, clientId, userId]);

  const onTabClick = (newTabId: string) => {
    navigate({
      to: "/agreements/$agreementId",
      search: (others) => ({ ...others, tab: newTabId }),
      params: { agreementId },
      replace: true,
    });
  };

  const agreementQuery = useGetAgreementData({
    agreementId,
  });
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
            <ChevronRightIcon
              className="h-4 w-4 flex-shrink-0"
              aria-hidden="true"
            />
            <Link
              to="/agreements/$agreementId"
              search={(current) => ({ tab: current?.tab || "summary" })}
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
                <MoveDownLeftIcon className="mr-2 h-4 w-4" />
                <span className="inline-block">Checkin</span>
              </Link>
            )}
            {isCheckedIn ? (
              <Link
                to="/agreements/$agreementId/check-in"
                search={() => ({ stage: "rental-information" })}
                params={{ agreementId: String(agreementId) }}
                className={cn(
                  buttonVariants({ size: "sm", variant: "secondary" })
                )}
              >
                <PencilIcon className="mr-2 h-4 w-4" />
                <span className="inline-block">Edit</span>
              </Link>
            ) : (
              <Link
                to="/agreements/$agreementId/edit"
                search={() => ({ stage: "rental-information" })}
                params={{ agreementId: String(agreementId) }}
                className={cn(
                  buttonVariants({ size: "sm", variant: "secondary" })
                )}
              >
                <PencilIcon className="mr-2 h-4 w-4" />
                <span className="inline-block">Edit</span>
              </Link>
            )}
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
                    <PrinterIcon className="mr-2 h-4 w-4 sm:mr-4" />
                    <span>Print</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MailPlusIcon className="mr-2 h-4 w-4 sm:mr-4" />
                    <span>Email</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BanIcon className="mr-2 h-4 w-4 sm:mr-4" />
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

export default AgreementViewPage;
