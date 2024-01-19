export function getXPaginationFromHeaders(headers: Headers | null): {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
} {
  let page = 0;
  let pageSize = 0;
  let totalPages = 0;
  let totalRecords = 0;

  /**
   * @important DO NOT remove the optional chaining as it'll break because of the QueryClient's persist plugin
   * */
  const paginationHeaders =
    headers instanceof Headers ? headers?.get?.("x-pagination") : null;

  if (paginationHeaders) {
    try {
      const parse = JSON.parse(paginationHeaders);

      page = parse?.currentPage ? parse?.currentPage : page;
      pageSize = parse?.pageSize ? parse?.pageSize : pageSize;
      totalRecords = parse?.totalCount ? parse?.totalCount : totalRecords;
      totalPages = parse?.totalPages ? parse?.totalPages : totalPages;
    } catch (error) {
      console.warn(
        "Failed parsing x-pagination header\nThe input passed to getXPaginationFromHeaders was",
        headers
      );
    }
  }

  return {
    page,
    pageSize,
    totalPages,
    totalRecords,
  };
}
