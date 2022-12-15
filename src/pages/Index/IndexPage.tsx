import AppShell from "../../components/app-shell";
import Protector from "../../routes/Protector";
import StatisticsWidget from "../../components/Dashboard/statistics-widget";
import BannerNotice from "../../components/Dashboard/banner-notice";
import DashboardDndWidgetGrid from "../../components/Dashboard/dnd-widget-grid";

import { useGetDashboardStats } from "../../hooks/network/dashboard/useGetDashboardStats";
import { useGetDashboardNoticeList } from "../../hooks/network/dashboard/useGetDashboardNoticeList";
import { useGetDashboardWidgetList } from "../../hooks/network/dashboard/useGetDashboardWidgetList";
import type { DashboardWidgetItemParsed } from "../../utils/schemas/dashboard";

function IndexPage() {
  const statistics = useGetDashboardStats({
    locationId: 0,
    clientDate: new Date(),
  });

  const widgetList = useGetDashboardWidgetList();

  const noticeList = useGetDashboardNoticeList();

  const handleWidgetSortingEnd = (widgets: DashboardWidgetItemParsed[]) => {
    // TODO: Save the new widget order to the server
    console.log("TODO: Save the new widget order to the server\n", widgets);
  };

  return (
    <Protector>
      <AppShell>
        {noticeList.data.length > 0 && (
          <div className="grid gap-1">
            {noticeList.data.map((notice) => (
              <BannerNotice notice={notice} key={notice.id} />
            ))}
          </div>
        )}
        <div className="py-6">
          <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          <div className="mx-auto max-w-full px-4 pt-4 sm:px-6 md:px-8">
            <StatisticsWidget statistics={statistics.data} />

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
      </AppShell>
    </Protector>
  );
}

export default IndexPage;
