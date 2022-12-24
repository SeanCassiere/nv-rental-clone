import { lazy, useEffect } from "react";
import { useParams, useRouter, useSearch } from "@tanstack/react-router";

import Protector from "../../routes/Protector";
import {
  ChevronLeftOutline,
  HamburgerMenuOutline,
} from "../../components/icons";
import { useGetCustomerData } from "../../hooks/network/customer/useGetCustomerData";
import {
  ModuleTabs,
  type ModuleTabConfigItem,
} from "../../components/PrimaryModule/ModuleTabs";
import { getStartingIndexFromTabName } from "../../utils/moduleTabs";

const SummaryTab = lazy(
  () => import("../../components/Customer/CustomerSummaryTab")
);

function CustomerViewPage() {
  const router = useRouter();
  const params = useParams();
  const search = useSearch();

  const customerId = params.customerId || "";
  const tabName = search?.tab || "";

  const tabsConfig: ModuleTabConfigItem[] = [
    {
      id: "summary",
      label: "Summary",
      component: <SummaryTab customerId={customerId} />,
    },
  ];

  const onFindError = () => {
    router.history.go(-1);
  };

  const onTabClick = (newTabName: string) => {
    router.navigate({
      to: "/customers/$customerId",
      params: { customerId },
      search: { tab: newTabName },
      replace: true,
    });
  };

  useGetCustomerData({
    customerId,
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
                <span className="text-gray-600">{customerId}</span>
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
          <div className="mt-6 bg-white p-4">Customer information modes</div>
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

export default CustomerViewPage;
