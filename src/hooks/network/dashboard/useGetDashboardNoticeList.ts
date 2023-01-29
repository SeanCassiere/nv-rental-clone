import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchDashboardNoticeList } from "../../../api/dashboard";
import { dashboardQKeys } from "../../../utils/query-key";
import { DashboardNoticeListParsed } from "../../../utils/schemas/dashboard";
import {
  getLocalStorageForUser,
  userLocalStorageKeys,
} from "../../../utils/user-local-storage";

export function useGetDashboardNoticeList() {
  const auth = useAuth();

  const query = useQuery({
    queryKey: dashboardQKeys.notices(),
    queryFn: () =>
      fetchDashboardNoticeListModded({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
      }),
    enabled: auth.isAuthenticated,
    initialData: [],
  });
  return query;
}

export async function fetchDashboardNoticeListModded({
  userId: navotar_userid,
  clientId: navotar_clientid,
}: {
  userId: string;
  clientId: string;
}) {
  return await fetchDashboardNoticeList()
    .then((data) => DashboardNoticeListParsed.parse(data))
    .then((res) => {
      const local = getLocalStorageForUser(
        navotar_clientid,
        navotar_userid,
        userLocalStorageKeys.dismissedNotices
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
      console.error(e);
      throw e;
    });
}
