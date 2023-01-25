import { useEffect } from "react";

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

function IndexPage() {
  const statistics = useGetDashboardStats({
    locationId: 0,
    clientDate: new Date(),
  });

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
          <h1 className="text-2xl font-semibold text-gray-700">Dashboard</h1>
        </div>
        <div className="mx-auto max-w-full px-4 pt-4 sm:px-6 md:px-8">
          <div className="pb-4">
            <h2 className="text-xl font-semibold text-gray-700">Overview</h2>
            <p className="hidden pt-2 text-sm text-gray-600 sm:block">
              Jump into what's going on with your fleet.
            </p>
          </div>
          <DashboardStatsBlock statistics={statistics.data} />

          <div className="pt-6 pb-2">
            <h2 className="text-xl font-semibold text-gray-700">Widgets</h2>
            <p className="hidden pt-2 text-sm text-gray-600 sm:block">
              My list of personalized widgets.
            </p>
          </div>
          <div className="mt-4">
            <DashboardDndWidgetGrid
              key={`${JSON.stringify(widgetList.data)}`}
              widgets={widgetList.data}
              selectedLocationIds={[0]}
              onWidgetSortingEnd={handleWidgetSortingEnd}
            />
          </div>
        </div>
      </div>
    </Protector>
  );
}

export default IndexPage;
