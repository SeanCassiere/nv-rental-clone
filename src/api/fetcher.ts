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
  };
}

export interface ResponseParsed<T> {
  data: T;
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

export function makeUrl(
  endpoint: string,
  params: Record<string, string | number | null | any[] | undefined>
) {
  const queryParams = new URLSearchParams();

  for (const key of Object.entries(params)) {
    const [keyName, value] = key;

    if (typeof value !== "undefined") {
      //
      if (Array.isArray(value)) {
        value.forEach((item) => {
          queryParams.append(keyName, `${item}`);
        });
      } else {
        //
        if (value !== "") {
          queryParams.append(keyName, `${value}`);
        }
      }
    }
  }

  const queryUrl = new URL(`${apiBaseUrl}${endpoint}`);
  queryUrl.search = queryParams.toString();

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
      console.log("failed parsing pagination from headers");
    }
  }

  if (response.ok) {
    const dto: ResponseParsed<any> = {
      data: await response.json(),
      page,
      pageSize,
      totalPages,
      totalRecords,
    };
    return dto as any;
  } else {
    await response.json().then((data) => {
      const message =
        data?.message ||
        "handleSuccess: something went wrong with the api call";
      throw message;
    });
  }
};

export const handleError = (error: Error) => {
  throw error;
};
