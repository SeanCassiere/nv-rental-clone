import { lazy, useMemo } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useRouter,
  useSearch,
} from "@tanstack/router";

import Protector from "../../components/Protector";
import {
  ArrowDownLeftOutline,
  ChevronRightOutline,
  PencilIconFilled,
  PrintIconFilled,
} from "../../components/icons";
import {
  ModuleTabs,
  type ModuleTabConfigItem,
} from "../../components/PrimaryModule/ModuleTabs";
import AgreementModuleStatBlock from "../../components/PrimaryModule/ModuleStatBlock/AgreementModuleStatBlock";
import CommonHeader from "../../components/Layout/CommonHeader";
import { Button, LinkButton } from "../../components/Form";

import {
  viewAgreementByIdRoute,
  editAgreementByIdRoute,
  checkinAgreementByIdRoute,
} from "../../routes/agreements/agreementIdPath";

import { useGetAgreementData } from "../../hooks/network/agreement/useGetAgreementData";
import { useDocumentTitle } from "../../hooks/internal/useDocumentTitle";

import { getStartingIndexFromTabName } from "../../utils/moduleTabs";
import { titleMaker } from "../../utils/title-maker";

const SummaryTab = lazy(
  () => import("../../components/Agreement/AgreementSummaryTab"),
);
const ModuleNotesTabContent = lazy(
  () => import("../../components/PrimaryModule/ModuleNotesTabContent"),
);
const AgreementExchangesTab = lazy(
  () => import("../../components/Agreement/AgreementExchangesTab"),
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
    titleMaker(
      (agreement.data?.agreementNumber || "Loading") + " - Agreements",
    ),
  );

  return (
    <Protector>
      <div className="py-6">
        <div className="mx-auto max-w-full px-2 sm:px-4">
          <CommonHeader
            titleContent={
              <div className="flex flex-col justify-between gap-4 md:flex-row md:gap-0">
                <div className="flex items-center gap-2">
                  <Link
                    to=".."
                    className="select-none text-2xl font-semibold leading-6 text-gray-700 hover:text-gray-800"
                    onClick={() => {
                      router.history.go(-1);
                    }}
                  >
                    Agreements
                  </Link>
                  <ChevronRightOutline
                    className="h-4 w-4 flex-shrink-0 text-gray-500"
                    aria-hidden="true"
                  />
                  <Link
                    to={viewAgreementByIdRoute.to}
                    search={(current) => ({ tab: current?.tab || "summary" })}
                    params={{ agreementId }}
                    className="max-w-[230px] truncate text-xl leading-6 text-gray-800 md:max-w-full"
                  >
                    {agreement?.data?.agreementNumber}
                  </Link>
                </div>
                <div className="flex flex-col gap-3 md:flex-row">
                  {isCheckedIn ? (
                    <LinkButton
                      to={checkinAgreementByIdRoute.to}
                      search={() => ({ stage: "rental-information" })}
                      params={{ agreementId: String(agreementId) }}
                      className="flex items-center justify-center gap-2"
                    >
                      <PencilIconFilled className="h-3 w-3" />
                      Edit
                    </LinkButton>
                  ) : (
                    <LinkButton
                      to={editAgreementByIdRoute.to}
                      search={() => ({ stage: "rental-information" })}
                      params={{ agreementId: String(agreementId) }}
                      className="flex items-center justify-center gap-2"
                    >
                      <PencilIconFilled className="h-3 w-3" />
                      Edit
                    </LinkButton>
                  )}
                  {!isCheckedIn && (
                    <LinkButton
                      to={checkinAgreementByIdRoute.to}
                      search={() => ({ stage: "rental-information" })}
                      params={{ agreementId: String(agreementId) }}
                      className="flex items-center justify-center gap-2"
                    >
                      <ArrowDownLeftOutline className="h-3.5 w-3.5" />
                      Checkin
                    </LinkButton>
                  )}
                  <Button
                    type="button"
                    color="teal"
                    className="flex items-center justify-center gap-2"
                  >
                    <PrintIconFilled className="h-3 w-3" />
                    Print
                  </Button>
                </div>
              </div>
            }
            headerActionContent
          />
          <div className="my-4 mt-2 sm:mt-6">
            <AgreementModuleStatBlock
              agreement={agreement.data}
              isCheckedIn={isCheckedIn}
            />
          </div>
        </div>

        <div className="mx-auto px-2 sm:px-4 md:grid-cols-12">
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

export default AgreementViewPage;
