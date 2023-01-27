import { lazy, useEffect, useMemo } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useRouter,
  useSearch,
} from "@tanstack/react-router";

import { viewCustomerRoute } from "../../routes/customers/viewCustomer";
import Protector from "../../components/Protector";
import {
  // ChevronLeftOutline,
  ChevronRightOutline,
} from "../../components/icons";
import { useGetCustomerData } from "../../hooks/network/customer/useGetCustomerData";
import {
  ModuleTabs,
  type ModuleTabConfigItem,
} from "../../components/PrimaryModule/ModuleTabs";
import ScrollToTop from "../../components/ScrollToTop";

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
    from: viewCustomerRoute.id,
  });

  const navigate = useNavigate({ from: viewCustomerRoute.id });

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
      to: viewCustomerRoute.id,
      search: (others) => ({ ...others, tab: newTab.id }),
      replace: true,
    });
  };

  const customer = useGetCustomerData({
    customerId,
    onError: onFindError,
  });

  useEffect(() => {
    document.title = titleMaker(
      (customer.data?.firstName && customer.data?.lastName
        ? customer.data?.firstName + " " + customer.data?.lastName
        : "Loading") + " - Customers"
    );
  }, [customer.data?.firstName, customer.data?.lastName]);

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
                      Customers
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
                      to={viewCustomerRoute.id}
                      params={{ customerId }}
                      search={() => ({ tab: "summary" })}
                      className="max-w-[230px] truncate pl-2 text-xl text-gray-900 md:max-w-full"
                    >
                      {customer?.data?.firstName}&nbsp;
                      {customer?.data?.lastName}
                    </Link>
                  </div>
                </li>
              </ol>
            </nav>
            {/*  */}
          </div>
          <div className="mt-6 bg-slate-50 p-4">Customer information modes</div>
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
