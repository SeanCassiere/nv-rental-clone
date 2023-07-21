import { lazy, useMemo } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useRouter,
  useSearch,
} from "@tanstack/router";

import Protector from "@/components/Protector";
import {
  ArrowDownLeftOutline,
  ChevronRightOutline,
  PencilIconFilled,
  PrintIconFilled,
} from "@/components/icons";
import {
  ModuleTabs,
  type ModuleTabConfigItem,
} from "@/components/primary-module/ModuleTabs";
import AgreementStatBlock from "@/components/primary-module/statistic-block/agreement-stat-block";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  viewAgreementByIdRoute,
  editAgreementByIdRoute,
  checkinAgreementByIdRoute,
} from "@/routes/agreements/agreementIdPath";

import { useGetAgreementData } from "@/hooks/network/agreement/useGetAgreementData";
import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";

import { getStartingIndexFromTabName } from "@/utils/moduleTabs";
import { titleMaker } from "@/utils/title-maker";
import { cn } from "@/utils";

const SummaryTab = lazy(
  () => import("../../components/Agreement/AgreementSummaryTab")
);
const ModuleNotesTabContent = lazy(
  () => import("../../components/primary-module/ModuleNotesTabContent")
);
const AgreementExchangesTab = lazy(
  () => import("../../components/Agreement/AgreementExchangesTab")
);

function AgreementViewPage() {
  const router = useRouter();

  const { tab: tabName = "summary" } = useSearch({
    from: viewAgreementByIdRoute.id,
  });

  const navigate = useNavigate({ from: viewAgreementByIdRoute.id });

  const params = useParams({
    from: viewAgreementByIdRoute.id,
  });

  const agreementId = params.agreementId || "";

  const tabsConfig = useMemo(() => {
    const tabs: ModuleTabConfigItem[] = [];

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

  const onTabClick = (newTab: ModuleTabConfigItem) => {
    navigate({
      to: viewAgreementByIdRoute.to,
      search: (others) => ({ ...others, tab: newTab.id }),
      params: { agreementId },
      replace: true,
    });
  };

  const handleFindError = () => {
    router.history.go(-1);
  };

  const agreement = useGetAgreementData({
    agreementId,
    onError: handleFindError,
  });
  const isCheckedIn = agreement.data?.returnDate ? true : false;

  useDocumentTitle(
    titleMaker((agreement.data?.agreementNumber || "Loading") + " - Agreements")
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
              Agreements
            </Link>
            <ChevronRightOutline
              className="h-4 w-4 flex-shrink-0 text-primary"
              aria-hidden="true"
            />
            <Link
              to={viewAgreementByIdRoute.to}
              search={(current) => ({ tab: current?.tab || "summary" })}
              params={{ agreementId }}
              className="max-w-[230px] truncate text-xl font-semibold leading-6 text-primary/80 md:max-w-full"
            >
              {agreement?.data?.agreementNumber}
            </Link>
          </div>
          <div className="flex w-full gap-2 sm:w-max">
            {isCheckedIn ? (
              <Link
                to={checkinAgreementByIdRoute.to}
                search={() => ({ stage: "rental-information" })}
                params={{ agreementId: String(agreementId) }}
                className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
              >
                <PencilIconFilled className="h-3 w-3  sm:mr-2" />
                <span className="hidden sm:inline-block">Edit</span>
              </Link>
            ) : (
              <Link
                to={editAgreementByIdRoute.to}
                search={() => ({ stage: "rental-information" })}
                params={{ agreementId: String(agreementId) }}
                className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
              >
                <PencilIconFilled className="h-3 w-3  sm:mr-2" />
                <span className="hidden sm:inline-block">Edit</span>
              </Link>
            )}
            <Button
              size="sm"
              type="button"
              className="flex items-center justify-center gap-2"
              variant="ghost"
            >
              <PrintIconFilled className="h-3 w-3 sm:mr-2" />
              <span className="hidden sm:inline-block">Print</span>
            </Button>
            {!isCheckedIn && (
              <Link
                to={checkinAgreementByIdRoute.to}
                search={() => ({ stage: "rental-information" })}
                params={{ agreementId: String(agreementId) }}
                className={cn(buttonVariants({ size: "sm" }))}
              >
                <ArrowDownLeftOutline className="h-3.5 w-3.5 sm:mr-2" />
                <span className="hidden sm:inline-block">Checkin</span>
              </Link>
            )}
          </div>
        </div>
        <p className={cn("text-base text-primary/80")}>
          View the details related to this rental.
        </p>
        <Separator className="mb-3.5 mt-3.5" />
        <AgreementStatBlock
          agreement={agreement.data}
          isCheckedIn={isCheckedIn}
        />
      </section>
      <section
        className={cn(
          "mx-auto my-6 mt-4 flex max-w-full flex-col gap-2 px-2 pb-6 sm:mx-4 sm:px-1"
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

export default AgreementViewPage;
