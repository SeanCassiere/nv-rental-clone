import {
  DashboardWidgetItemListSchema,
  type DashboardWidgetItemParsed,
} from "@/schemas/dashboard";

import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

export const fetchDashboardWidgetList = async (opts: CommonAuthParams) => {
  return await callV3Api(
    makeUrl(`/v3/dashboard`, {
      clientId: opts.clientId,
      userId: opts.userId,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => DashboardWidgetItemListSchema.parse(res.data));
};

export const saveDashboardWidgetItem = async (
  opts: { widget: DashboardWidgetItemParsed } & CommonAuthParams
) => {
  const body = {
    ...opts.widget,
    widgetScale: String(opts.widget.widgetScale),
    clientID: Number(opts.clientId),
    userID: Number(opts.userId),
  };

  return await callV3Api(makeUrl("/v3/dashboard", {}), {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${opts.accessToken}`,
    },
  });
};
