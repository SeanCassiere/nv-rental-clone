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
