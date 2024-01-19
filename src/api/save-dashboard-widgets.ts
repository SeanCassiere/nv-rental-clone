import type { DashboardWidgetItemParsed } from "@/schemas/dashboard";

import type { Auth } from "@/utils/query/helpers";

import { apiClient } from "@/api";

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
