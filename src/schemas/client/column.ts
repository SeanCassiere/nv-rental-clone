import { z } from "zod";

const ClientColumnHeaderItemSchema = z.object({
  columnHeader: z.string(),
  typeName: z.string().nullable(),
  columnHeaderDescription: z.string().nullable(),
  searchText: z.string(),
  isSelected: z.preprocess(
    (val) => (typeof val === "string" ? val === "true" : val),
    z.boolean()
  ),
  columnHeaderSettingID: z.number(),
  columnIndex: z.number(),
  orderIndex: z.number(),
});

export type TColumnHeaderItem = z.infer<typeof ClientColumnHeaderItemSchema>;
export const ClientColumnHeadersListSchema = z.array(
  ClientColumnHeaderItemSchema
);

export const SaveClientColumnHeaderInfoSchema = z.object({
  clientID: z.string(),
  userID: z.string(),
  type: z.number(),
  typeName: z.enum(["Agreement", "Customer", "Vehicle", "Reservation"]),
  headerSettingIDList: z.string(),
  orderdHeaderSettingIDList: z.string(),
});
export const SaveClientColumnHeaderInfoResponseSchema = z.object({
  message: z.string(),
  widgetMappingID: z.number(),
});
