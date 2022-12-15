import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { saveDashboardWidgetItem } from "../../../api/dashboard";
import type { DashboardWidgetItemParsed } from "../../../utils/schemas/dashboard";

export function useSaveDashboardWidgetList() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      widgets,
    }: {
      widgets: DashboardWidgetItemParsed[];
    }) => {
      const savePromises = widgets.map((widget) =>
        saveDashboardWidgetItem({
          widget,
          clientId: auth.user?.profile.navotar_clientid || "",
          userId: auth.user?.profile.navotar_userid || "",
          accessToken: auth.user?.access_token || "",
        })
      );
      await Promise.all(savePromises);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["dashboard", "widgets"]);
    },
  });

  return mutation;
}
