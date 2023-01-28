import { useEffect, useState } from "react";
import classNames from "classnames";

import Protector from "../../components/Protector";
import DashboardStatsBlock from "../../components/Dashboard/DashboardStatsBlock";
import DashboardBannerNotices from "../../components/Dashboard/DashboardBannerNotices";
import DashboardDndWidgetGrid from "../../components/Dashboard/DashboardDndWidgetGrid";
import ScrollToTop from "../../components/ScrollToTop";

import type { DashboardWidgetItemParsed } from "../../utils/schemas/dashboard";
import { useGetDashboardStats } from "../../hooks/network/dashboard/useGetDashboardStats";
import { useGetDashboardNoticeList } from "../../hooks/network/dashboard/useGetDashboardNoticeList";
import { useGetDashboardWidgetList } from "../../hooks/network/dashboard/useGetDashboardWidgetList";
import { useSaveDashboardWidgetList } from "../../hooks/network/dashboard/useSaveDashboardWidgetList";
import { titleMaker } from "../../utils/title-maker";
import {
  LockClosedOutline,
  LockOpenOutline,
  SettingsCogOutline,
} from "../../components/icons";

function IndexPage() {
  const statistics = useGetDashboardStats({
    locationId: 0,
    clientDate: new Date(),
  });

  const [isWidgetsLocked, setIsWidgetsLocked] = useState(true);

  const widgetList = useGetDashboardWidgetList();

  const noticeList = useGetDashboardNoticeList();

  const saveDashboardWidgetsMutation = useSaveDashboardWidgetList();

  const handleWidgetSortingEnd = (widgets: DashboardWidgetItemParsed[]) => {
    saveDashboardWidgetsMutation.mutate({ widgets });
  };

  useEffect(() => {
    document.title = titleMaker("Dashboard");
  }, []);

  return (
    <Protector>
      <ScrollToTop />
      {noticeList.data.length > 0 && (
        <div className="grid gap-1">
          {noticeList.data.map((notice) => (
            <DashboardBannerNotices notice={notice} key={notice.id} />
          ))}
        </div>
      )}
      <div className="py-6">
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <h1 className="select-none text-2xl font-semibold text-gray-700">
            Dashboard
          </h1>
        </div>
        <div className="mx-auto max-w-full px-4 pt-4 sm:px-6 md:px-8">
          <div className="pb-4">
            <h2 className="text-xl font-semibold text-gray-700">Overview</h2>
            <p className="hidden select-none pt-2 text-sm text-gray-600 sm:block">
              Jump into what's going on with your fleet.
            </p>
          </div>
          <DashboardStatsBlock statistics={statistics.data} />

          <div className="pt-6 pb-2">
            <h2 className="select-none text-xl font-semibold text-gray-700">
              Widgets
              <span className="ml-4 inline-block sm:ml-5">
                <button className="pt-2 text-slate-500 sm:pt-0">
                  <SettingsCogOutline className="h-5 w-5 sm:h-4 sm:w-4" />
                </button>
                <button
                  className={classNames(
                    "ml-2 text-slate-500 sm:pt-0",
                    isWidgetsLocked ? "" : "pl-0.5"
                  )}
                  onClick={() => setIsWidgetsLocked((prev) => !prev)}
                >
                  {isWidgetsLocked ? (
                    <LockClosedOutline className="h-5 w-5 sm:h-4 sm:w-4" />
                  ) : (
                    <LockOpenOutline className="h-5 w-5 sm:h-4 sm:w-4" />
                  )}
                </button>
              </span>
            </h2>
            <p className="hidden select-none pt-2 text-sm text-gray-600 sm:block">
              My list of personalized widgets.
            </p>
          </div>
          <div className="mt-4">
            <DashboardDndWidgetGrid
              key={`${JSON.stringify(widgetList.data)}`}
              widgets={widgetList.data}
              selectedLocationIds={[0]}
              onWidgetSortingEnd={handleWidgetSortingEnd}
              isLocked={isWidgetsLocked}
            />
          </div>
        </div>
      </div>
    </Protector>
  );
}

export default IndexPage;
