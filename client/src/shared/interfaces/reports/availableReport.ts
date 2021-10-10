export interface IR_AvailableReport {
	reportId: number;
	title: string;
	isChart: boolean;
	name: string;
	isPrintable: boolean;
	isExportableToExcel: boolean;
	isExportableToCSV: boolean;
	isExportableToPdf: boolean;
	reportType: number;
	reportSP: string;
	height: number;
	width: number;
	reportCategory: string;
	groupColumnName: string | null;
	xmL_URL: string | null;
	path: string | null;
	clientId: number | null;
	folderId: number;
	baseReportId: number | null;
	userId: number | null;
	isDynamicReport: boolean;
	outputFields: null;
	searchCriteria: null;
	baseOutputFields: null;
}
