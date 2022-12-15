export type DashboardStatsType = {
  openAgreement: number;
  overDues: number;
  dueIn: number;
  todaysReservationCount: number;
  todaysArrivalsCount: number;
  serviceAlerts: number;
  onHoldAgreements: number;
  paymentDelay: number;
  pendingPayment: number;
};

export type DashboardNoticeType = {
  id: string;
  titleText: string;
  titleTextShort: string;
  actionText: string | null;
  startDate: string | null;
  endDate: string | null;
  link: string | null;
  ignoreDismiss: boolean;
};

export type DashboardWidgetListItemType = {
  widgetID: string;
  widgetName: string;
  widgetScale: string; // eg: "6"
  widgetPosition: number;
  widgetMappingID: number;
  clientID: number;
  userID: number;
  widgetUserPosition: number;
  isEditable: boolean;
  isDeleted: boolean;
};
