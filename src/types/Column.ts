export type ColumnResponseType = {
  columnHeader: string;
  typeName: string;
  columnHeaderDescription: string;
  searchText: string;
  isSelected: "true" | "false";
  columnHeaderSettingID: number;
  columnIndex: number;
  orderIndex: number;
};

export type ColumnListItemType = {
  columnHeader: string;
  typeName: string;
  columnHeaderDescription: string;
  searchText: string;
  isSelected: boolean;
  columnHeaderSettingID: number;
  columnIndex: number;
  orderIndex: number;
};
