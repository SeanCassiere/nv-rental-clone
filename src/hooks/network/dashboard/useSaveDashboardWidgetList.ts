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
      Promise.all(savePromises);
    },
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(["dashboard", "widgets"]);

      // Snapshot the previous value
      const previousWidgets = queryClient.getQueryData([
        "dashboard",
        "widgets",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(["dashboard", "widgets"], ((old: any[]) => [
        ...(old ? old : []),
        ...variables.widgets,
      ]) as any);

      // Return a context object with the snapshotted value
      return { previousWidgets };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        ["dashboard", "widgets"],
        context?.previousWidgets || []
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(["dashboard", "widgets"]);
    },
  });

  return mutation;
}
