import { z } from "zod";

const ColumnListItemSchema = z.object({
  columnHeader: z.string(),
  typeName: z.string().nullable(),
  columnHeaderDescription: z.string().nullable(),
  searchText: z.string(),
  isSelected: z.coerce.boolean(),
  columnHeaderSettingID: z.number(),
  columnIndex: z.number(),
  orderIndex: z.number(),
});

export type TColumnListItemParsed = z.infer<typeof ColumnListItemSchema>;
export const ColumnListItemListSchema = z.array(ColumnListItemSchema);
