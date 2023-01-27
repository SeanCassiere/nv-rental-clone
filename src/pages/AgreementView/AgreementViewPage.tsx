import { lazy, useEffect, useMemo } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useRouter,
  useSearch,
} from "@tanstack/react-router";

import { viewAgreementRoute } from "../../routes/agreements/viewAgreement";
import Protector from "../../components/Protector";
import { ChevronRightOutline } from "../../components/icons";
import ScrollToTop from "../../components/ScrollToTop";

import { useGetAgreementData } from "../../hooks/network/agreement/useGetAgreementData";
import {
  ModuleTabs,
  type ModuleTabConfigItem,
} from "../../components/PrimaryModule/ModuleTabs";
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

  useEffect(() => {
    document.title = titleMaker(
      (agreement.data?.agreementNumber || "Loading") + " - Agreements"
    );
  }, [agreement.data?.agreementNumber]);

  return (
    <Protector>
      <ScrollToTop />
      <div className="py-6">
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <div className="flex w-full flex-col justify-between md:flex-row md:items-center">
            <nav className="flex grow items-center" aria-label="Breadcrumb">
              <ol className="flex items-end space-x-2">
                <li>
                  <div className="flex">
                    <Link
                      to=".."
                      className="text-2xl font-semibold leading-tight tracking-tight text-gray-700 hover:text-gray-800"
                      onClick={() => {
                        router.history.go(-1);
                      }}
                    >
                      Agreements
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightOutline
                      className="h-3.5 w-3.5 flex-shrink-0 text-gray-500"
                      aria-hidden="true"
                    />
                    <Link
                      to={viewAgreementRoute.id}
                      search={(current) => ({ tab: current?.tab || "summary" })}
                      params={{ agreementId }}
                      className="max-w-[230px] truncate pl-2 text-xl text-gray-900 md:max-w-full"
                    >
                      {agreement?.data?.agreementNumber}
                    </Link>
                  </div>
                </li>
              </ol>
            </nav>
            {/*  */}
          </div>
          <div className="mt-6 bg-slate-50 p-4">
            Agreement information modes
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
