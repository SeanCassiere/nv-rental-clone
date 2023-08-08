import { lazy, useMemo, useEffect, Suspense, type ReactNode } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useRouter,
  useSearch,
} from "@tanstack/router";
import {
  MoreVerticalIcon,
  PencilIcon,
  PrinterIcon,
  MailPlusIcon,
  BanIcon,
  MoveDownLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

import ProtectorShield from "@/components/protector-shield";
import AgreementStatBlock from "@/components/primary-module/statistic-block/agreement-stat-block";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  viewAgreementByIdRoute,
  editAgreementByIdRoute,
  checkinAgreementByIdRoute,
} from "@/routes/agreements/agreement-id-route";

import { useGetAgreementData } from "@/hooks/network/agreement/useGetAgreementData";
import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";

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

  const { tab: tabName = "summary" } = useSearch({
    from: viewAgreementByIdRoute.id,
  });

  const navigate = useNavigate();

  const params = useParams({
    from: viewAgreementByIdRoute.id,
  });

  const agreementId = params.agreementId || "";

  const tabsConfig = useMemo(() => {
    const tabs: { id: string; label: string; component: ReactNode }[] = [];

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
    tabs.push({
      id: "documents",
      label: "Documents",
      component: "Documents Tab",
    });
    tabs.push({
      id: "charges",
      label: "Charges",
      component: "Charges Tab",
    });
    tabs.push({
      id: "exchanges",
      label: "Exchanges",
      component: <AgreementExchangesTab referenceId={agreementId} />,
    });
    return tabs;
  }, [agreementId]);

  const onTabClick = (newTabId: string) => {
    navigate({
      to: viewAgreementByIdRoute.to,
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
            <Link
              className="text-2xl font-semibold leading-6"
              onClick={() => {
                router.history.go(-1);
              }}
            >
              Agreements
            </Link>
            <ChevronRightIcon
              className="h-4 w-4 flex-shrink-0"
              aria-hidden="true"
            />
            <Link
              to={viewAgreementByIdRoute.to}
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
                to={checkinAgreementByIdRoute.to}
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
                to={checkinAgreementByIdRoute.to}
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
                to={editAgreementByIdRoute.to}
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

export default AgreementViewPage;
