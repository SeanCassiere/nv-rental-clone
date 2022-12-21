import { useEffect } from "react";

import Protector from "../../routes/Protector";
import DashboardStatsBlock from "../../components/Dashboard/DashboardStatsBlock";
import DashboardBannerNotices from "../../components/Dashboard/DashboardBannerNotices";
import DashboardDndWidgetGrid from "../../components/Dashboard/DashboardDndWidgetGrid";

import type { DashboardWidgetItemParsed } from "../../utils/schemas/dashboard";
import { useGetDashboardStats } from "../../hooks/network/dashboard/useGetDashboardStats";
import { useGetDashboardNoticeList } from "../../hooks/network/dashboard/useGetDashboardNoticeList";
import { useGetDashboardWidgetList } from "../../hooks/network/dashboard/useGetDashboardWidgetList";
import { useSaveDashboardWidgetList } from "../../hooks/network/dashboard/useSaveDashboardWidgetList";

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
    window.scrollTo(0, 0);
  }, []);

  return (
    <Protector>
      {noticeList.data.length > 0 && (
        <div className="grid gap-1">
          {noticeList.data.map((notice) => (
            <DashboardBannerNotices notice={notice} key={notice.id} />
          ))}
        </div>
      )}
      <div className="py-6">
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        <div className="mx-auto max-w-full px-4 pt-4 sm:px-6 md:px-8">
          <DashboardStatsBlock statistics={statistics.data} />

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
