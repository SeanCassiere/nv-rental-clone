import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchDashboardNoticeList } from "../../../api/dashboard";
import { DashboardNoticeListParsed } from "../../../utils/schemas/dashboard";

export function useGetDashboardNoticeList() {
  const auth = useAuth();

  const query = useQuery({
    queryKey: ["dashboard", "notices"],
    queryFn: () =>
      fetchDashboardNoticeList()
        .then((data) => DashboardNoticeListParsed.parse(data))
        .then((res) => {
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
            return false;
          });

          return notices;
        })
        .catch((e) => {
          console.log(e);
          throw e;
        }),
    enabled: auth.isAuthenticated,
    initialData: [],
  });
  return query;
}
