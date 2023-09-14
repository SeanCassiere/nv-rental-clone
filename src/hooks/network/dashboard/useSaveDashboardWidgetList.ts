import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import type { DashboardWidgetItemParsed } from "@/schemas/dashboard";

import { dashboardQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

export function useSaveDashboardWidgetList() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      widgets,
    }: {
      widgets: DashboardWidgetItemParsed[];
    }) => {
      const savePromises = widgets.map(({ widgetScale, ...widget }) =>
        apiClient.dashboard.saveWidget({
          body: {
            ...widget,
            widgetScale: String(widgetScale),
            clientID: Number(auth.user?.profile.navotar_clientid || "0"),
            userID: Number(auth.user?.profile.navotar_userid || "0"),
          },
        })
      );
      await Promise.all(savePromises);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: dashboardQKeys.widgets() });
    },
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: dashboardQKeys.widgets() });
    },
  });

  return mutation;
}
