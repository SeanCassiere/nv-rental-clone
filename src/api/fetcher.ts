export const apiBaseUrl = import.meta.env.VITE_APP_API_URI
  ? `${import.meta.env.VITE_APP_API_URI}/api`
  : "https://testapi.appnavotar.com/api";

export interface CommonAuthParams {
  accessToken: string;
  clientId: string;
  userId: string;
}

export function makeInitialApiData<T>(initialData: T) {
  return {
    data: initialData,
    page: 0,
    pageSize: 0,
    totalPages: 0,
    totalRecords: 0,
    status: 200,
    ok: true,
    isRequestMade: false,
  };
}

export function makeUrl(
  endpoint: string,
  params: Record<string, string | number | null | any[] | undefined>
) {
  const urlSearchParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (typeof value === "undefined") return acc;

    if (typeof value === "string" && value !== "") {
      acc.append(key, value);
    }

    if (typeof value === "number") {
      acc.append(key, `${value}`);
    }

    if (value === null) {
      acc.append(key, "null");
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        acc.append(key, `${item}`);
      });
    }

    return acc;
  }, new URLSearchParams());

  const queryUrl = new URL(`${apiBaseUrl}${endpoint}`);
  queryUrl.search = urlSearchParams.toString();

  return queryUrl;
}

export async function callV3Api(url: RequestInfo | URL, options?: RequestInit) {
  const headerOptions: RequestInit = {
    ...options,
    headers: { ...options?.headers, "Content-Type": "application/json" },
    // credentials: "include",
  };
  return fetch(url, headerOptions).then(handleSuccess).catch(handleError);
}

export const handleSuccess = async (response: Response) => {
  let page = 0;
  let pageSize = 0;
  let totalPages = 0;
  let totalRecords = 0;

  const paginationString = response.headers.get("X-Pagination");

  if (paginationString) {
    try {
      const parse = JSON.parse(paginationString);

      page = parse?.currentPage ? parse?.currentPage : page;
      pageSize = parse?.pageSize ? parse?.pageSize : pageSize;
      totalRecords = parse?.totalCount ? parse?.totalCount : totalRecords;
      totalPages = parse?.totalPages ? parse?.totalPages : totalPages;
    } catch (error) {
      console.warn("Failed parsing x-pagination header\n", paginationString);
    }
  }

  return {
    ok: response.ok,
    status: response.status,
    page,
    pageSize,
    totalPages,
    totalRecords,
    isRequestMade: true,
    data: await response.json(),
  };
};

export const handleError = (error: Error) => {
  throw error;
};
