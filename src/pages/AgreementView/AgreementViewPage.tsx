import { lazy } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useRouter,
  useSearch,
} from "@tanstack/react-router";

import { viewAgreementRoute } from "../../routes/agreements/viewAgreement";
import Protector from "../../components/Protector";
import {
  ChevronRightOutline,
  HamburgerMenuOutline,
} from "../../components/icons";
import ScrollToTop from "../../components/ScrollToTop";

import { useGetAgreementData } from "../../hooks/network/agreement/useGetAgreementData";
import {
  ModuleTabs,
  type ModuleTabConfigItem,
} from "../../components/PrimaryModule/ModuleTabs";
import { getStartingIndexFromTabName } from "../../utils/moduleTabs";

const SummaryTab = lazy(
  () => import("../../components/Agreement/AgreementSummaryTab")
);
const PaymentsTab = lazy(
  () => import("../../components/PrimaryModule/ModulePayments/Tab")
);
const InvoicesTab = lazy(
  () => import("../../components/PrimaryModule/ModuleInvoices/Tab")
);

function AgreementViewPage() {
  const router = useRouter();

  const { tab: tabName = "" } = useSearch({
    from: viewAgreementRoute.id,
  });

  const navigate = useNavigate({ from: viewAgreementRoute.id });

  const params = useParams({
    from: viewAgreementRoute.id,
  });

  const agreementId = params.agreementId || "";

  const tabsConfig: ModuleTabConfigItem[] = [
    {
      id: "summary",
      label: "Summary",
      component: <SummaryTab agreementId={agreementId} />,
    },
    {
      id: "payments",
      label: "Payments",
      component: <PaymentsTab />,
    },
    {
      id: "invoices",
      label: "Invoices",
      component: <InvoicesTab />,
    },
  ];

  const onTabClick = (newTabName: string) => {
    navigate({
      to: viewAgreementRoute.id,
      search: (others) => ({ ...others, tab: newTabName }),
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

  return (
    <Protector>
      <ScrollToTop />
      <div className="py-6">
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <div className="flex w-full flex-col justify-between gap-4 md:flex-row md:items-center md:gap-8">
            <nav className="flex grow items-center" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <div className="flex">
                    <Link
                      to=".."
                      className="text-2xl font-semibold text-gray-600 hover:text-gray-800"
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
                      className="h-5 w-5 flex-shrink-0 text-gray-500"
                      aria-hidden="true"
                    />
                    <Link
                      to={viewAgreementRoute.id}
                      params={{ agreementId }}
                      className="pl-2 text-2xl text-gray-900"
                    >
                      {agreement?.data?.agreementNumber}
                    </Link>
                  </div>
                </li>
              </ol>
            </nav>
            {/*  */}
            <div className="flex flex-row items-center justify-end gap-4 md:gap-8">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 font-semibold shadow"
              >
                <HamburgerMenuOutline className="h-7 w-7" />
                <span className="sr-only">Options</span>
              </button>
            </div>
          </div>
          <div className="mt-6 bg-white p-4">Agreement information modes</div>
        </div>

        <div className="mx-auto px-4 sm:px-6 md:grid-cols-12 md:px-8">
          <ModuleTabs
            key={`changing-tab-${tabName}`}
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
