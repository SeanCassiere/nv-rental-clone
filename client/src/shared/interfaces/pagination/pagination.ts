export interface XPagination {
	totalCount: number;
	pageSize: number;
	currentPage: number;
	totalPages: number;
	previousPageLink: string | null;
	nextPageLink: string | null;
}
