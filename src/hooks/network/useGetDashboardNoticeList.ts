import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchDashboardNoticeList } from "../../api/dashboard";
import type { DashboardNoticeType } from "../../types/Dashboard";

export function useGetDashboardNoticeList() {
  const auth = useAuth();

  const query = useQuery<DashboardNoticeType[]>({
    queryKey: ["dashboard", "notices"],
    queryFn: () =>
      fetchDashboardNoticeList().then((res) => {
        const local = window.localStorage.getItem(
          `${auth.user?.profile.navotar_clientid}:${auth.user?.profile.navotar_userid}:dismissed-notices`
        );
        const dismissedNoticeIds: string[] = local ? JSON.parse(local) : [];

        const notices = res.filter((notice) => {
          if (notice.ignoreDismiss) {
            return notice;
          }
          if (!dismissedNoticeIds.includes(notice.id)) {
            return notice;
          }
        });

        return notices;
      }),
    enabled: auth.isAuthenticated,
    initialData: [] as DashboardNoticeType[],
  });
  return query;
}
