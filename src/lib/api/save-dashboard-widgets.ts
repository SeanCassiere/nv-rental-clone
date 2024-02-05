import type { DashboardWidgetItemParsed } from "@/lib/schemas/dashboard";
import type { Auth } from "@/lib/query/helpers";

import { apiClient } from "@/lib/api";

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
