import { z } from "zod";

const DashboardWidgetItemSchema = z.object({
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
export const DashboardWidgetItemListSchema = z.array(DashboardWidgetItemSchema);
export type DashboardWidgetItemParsed = z.infer<
  typeof DashboardWidgetItemSchema
>;
