import { lazy, useMemo } from "react";
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
import ScrollToTop from "../../components/ScrollToTop";
import CommonHeader from "../../components/Layout/CommonHeader";

import { viewCustomerByIdRoute } from "../../routes/customers/customerIdPath";

import { useGetCustomerData } from "../../hooks/network/customer/useGetCustomerData";
import { useDocumentTitle } from "../../hooks/internal/useDocumentTitle";

import { getStartingIndexFromTabName } from "../../utils/moduleTabs";
import { titleMaker } from "../../utils/title-maker";

const SummaryTab = lazy(
  () => import("../../components/Customer/CustomerSummaryTab")
);
const ModuleNotesTabContent = lazy(
  () => import("../../components/PrimaryModule/ModuleNotesTabContent")
);

function CustomerViewPage() {
  const router = useRouter();
  const params = useParams();

  const { tab: tabName = "summary" } = useSearch({
    from: viewCustomerByIdRoute.id,
  });

  const navigate = useNavigate({ from: viewCustomerByIdRoute.id });

  const customerId = params.customerId || "";

  const tabsConfig = useMemo(() => {
    const tabs: ModuleTabConfigItem[] = [];

    tabs.push({
      id: "summary",
      label: "Summary",
      component: <SummaryTab customerId={customerId} />,
    });
    tabs.push({
      id: "notes",
      label: "Notes",
      component: (
        <ModuleNotesTabContent module="customers" referenceId={customerId} />
      ),
    });
    tabs.push({
      id: "documents",
      label: "Documents",
      component: "Documents Tab",
    });

    return tabs;
  }, [customerId]);

  const onFindError = () => {
    router.history.go(-1);
  };

  const onTabClick = (newTab: ModuleTabConfigItem) => {
    navigate({
      to: viewCustomerByIdRoute.fullPath,
      search: (others) => ({ ...others, tab: newTab.id }),
      params: { customerId },
      replace: true,
    });
  };

  const customer = useGetCustomerData({
    customerId,
    onError: onFindError,
  });

  useDocumentTitle(
    titleMaker(
      (customer.data?.firstName && customer.data?.lastName
        ? customer.data?.firstName + " " + customer.data?.lastName
        : "Loading") + " - Customers"
    )
  );

  return (
    <Protector>
      <ScrollToTop />
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
                  Customers
                </Link>
                <ChevronRightOutline
                  className="h-4 w-4 flex-shrink-0 text-gray-500"
                  aria-hidden="true"
                />
                <Link
                  to={viewCustomerByIdRoute.fullPath}
                  search={(current) => ({ tab: current?.tab || "summary" })}
                  params={{ customerId }}
                  className="max-w-[230px] truncate text-xl leading-6 text-gray-800 md:max-w-full"
                >
                  {customer?.data?.firstName}&nbsp;
                  {customer?.data?.lastName}
                </Link>
              </div>
            }
            headerActionContent
          />
          <div className="my-4 mt-2 bg-slate-50 p-4 sm:mt-6">
            Customer information modes
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

export default CustomerViewPage;
