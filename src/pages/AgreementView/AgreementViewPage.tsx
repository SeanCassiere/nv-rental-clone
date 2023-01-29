import { lazy, useEffect, useMemo } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useRouter,
  useSearch,
} from "@tanstack/react-router";

import Protector from "../../components/Protector";
import { ChevronRightOutline } from "../../components/icons";
import {
  ModuleTabs,
  type ModuleTabConfigItem,
} from "../../components/PrimaryModule/ModuleTabs";
import AgreementModuleStatBlock from "../../components/PrimaryModule/ModuleStatBlock/AgreementModuleStatBlock";
import CommonHeader from "../../components/Layout/CommonHeader";

import { viewAgreementRoute } from "../../routes/agreements/viewAgreement";

import { useGetAgreementData } from "../../hooks/network/agreement/useGetAgreementData";

import { getStartingIndexFromTabName } from "../../utils/moduleTabs";
import { titleMaker } from "../../utils/title-maker";

const SummaryTab = lazy(
  () => import("../../components/Agreement/AgreementSummaryTab")
);
const ModuleNotesTabContent = lazy(
  () => import("../../components/PrimaryModule/ModuleNotesTabContent")
);
const AgreementExchangesTab = lazy(
  () => import("../../components/Agreement/AgreementExchangesTab")
);

function AgreementViewPage() {
  const router = useRouter();

  const { tab: tabName = "summary" } = useSearch({
    from: viewAgreementRoute.id,
  });

  const navigate = useNavigate({ from: viewAgreementRoute.id });

  const params = useParams({
    from: viewAgreementRoute.id,
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
      to: viewAgreementRoute.id,
      search: (others) => ({ ...others, tab: newTab.id }),
      replace: true,
    });
  };

  const onFindError = () => {
    router.history.go(-1);
  };

  const agreement = useGetAgreementData({
    agreementId,
    onError: onFindError,
  });
  const isCheckedIn = agreement.data?.returnDate ? true : false;

  useEffect(() => {
    document.title = titleMaker(
      (agreement.data?.agreementNumber || "Loading") + " - Agreements"
    );
  }, [agreement.data?.agreementNumber]);

  return (
    <Protector>
      <div className="py-6">
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <CommonHeader
            titleContent={
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
                  to={viewAgreementRoute.id}
                  search={(current) => ({ tab: current?.tab || "summary" })}
                  params={{ agreementId }}
                  className="max-w-[230px] truncate text-xl leading-6 text-gray-800 md:max-w-full"
                >
                  {agreement?.data?.agreementNumber}
                </Link>
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

        <div className="mx-auto px-4 sm:px-6 md:grid-cols-12 md:px-8">
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
