import { apiClient } from "@/api";
import type { Auth } from "@/lib/query/helpers";
import type { DashboardWidgetItemParsed } from "@/lib/schemas/dashboard";

export async function saveDashboardWidgets(
  options: { widgets: DashboardWidgetItemParsed[] } & Auth
) {
  const promises = options.widgets.map(({ widgetScale, ...widget }) =>
    apiClient.dashboard.saveWidget({
      body: {
        ...widget,
        widgetScale: String(widgetScale),
        clientID: Number(options.auth.clientId),
        userID: Number(options.auth.userId),
      },
    })
  );

  await Promise.all(promises);
}
