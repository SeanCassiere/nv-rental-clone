import { rootRoute } from "../../routes/Router";
import AppShell from "../../components/app-shell";
import Protector from "../../routes/Protector";
import StatisticsWidget from "../../components/Dashboard/statistics-widget";
import BannerNotice from "../../components/Dashboard/banner-notice";
import { useGetUserProfile } from "../../hooks/network/useGetUserProfile";
import { useGetDashboardStats } from "../../hooks/network/useGetDashboardStats";
import { useGetDashboardNoticeList } from "../../hooks/network/useGetDashboardNoticeList";

export const indexRoute = rootRoute.createRoute({
  path: "/",
  component: IndexPage,
});

function IndexPage() {
  const userQuery = useGetUserProfile();
  const statistics = useGetDashboardStats({
    locationId: 0,
    clientDate: new Date(),
  });
  const noticeList = useGetDashboardNoticeList();

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

            <div className="py-4">
              <div className="border-4 border-dashed border-gray-200 bg-white">
                <pre className="min-h-[50px] overflow-x-scroll text-sm">
                  {JSON.stringify(userQuery.data, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    </Protector>
  );
}

export default IndexPage;
