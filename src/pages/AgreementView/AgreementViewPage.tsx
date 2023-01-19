import { useEffect, lazy } from "react";
import {
  useNavigate,
  useParams,
  useRouter,
  useSearch,
} from "@tanstack/react-router";

import { viewAgreementRoute } from "../../routes";
import Protector from "../../routes/Protector";
import {
  ChevronLeftOutline,
  HamburgerMenuOutline,
} from "../../components/icons";
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

  useGetAgreementData({
    agreementId,
    onError: onFindError,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Protector>
      <div className="py-6">
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <div className="flex w-full flex-col justify-between gap-4 md:flex-row md:items-center md:gap-8">
            <div className="flex flex-row items-center gap-4 md:gap-8">
              <button
                onClick={() => {
                  router.history.go(-1);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 font-semibold shadow"
              >
                <ChevronLeftOutline className="h-7 w-7" />
                <span className="sr-only">Go back</span>
              </button>
              <h1 className="truncate text-2xl font-semibold text-gray-900">
                No.&nbsp;
                <span className="text-gray-600">{agreementId}</span>
              </h1>
            </div>
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
