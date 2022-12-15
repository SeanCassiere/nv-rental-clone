import { z } from "zod";

const dashboardWidgetItemSchema = z.object({
  widgetID: z.string(),
  widgetName: z.string(),
  widgetScale: z.coerce.number(),
  widgetPosition: z.number(),
  widgetMappingID: z.number(),
  widgetUserPosition: z.number(),
  isEditable: z.boolean(),
  isDeleted: z.boolean(),
  // clientID: z.number(),
  // userID: z.number(),
});
export const dashboardWidgetItemListSchema = z.array(dashboardWidgetItemSchema);
export type DashboardWidgetItemParsed = z.infer<
  typeof dashboardWidgetItemSchema
>;
