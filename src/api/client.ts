import { initClient, type ApiFetcher } from "@ts-rest/core";

import { contract } from "@/api/_root.contract";

import { getAuthToken } from "@/utils/authLocal";
import { apiBaseUrl } from "@/utils/constants";

const customFetchApi: ApiFetcher = async ({
  path,
  method,
  headers,
  body,
  credentials,
  signal,
  cache,
  next,
  route,
}) => {
  const result = await fetch(path, {
    method,
    headers,
    body,
    credentials,
    signal,
    cache,
    next,
  } as RequestInit);
  const contentType = result.headers.get("content-type");

  if (contentType?.includes("application/") && contentType?.includes("json")) {
    const json = await result.json();

    return {
      status: result.status,
      body:
        result.status in route.responses
          ? // @ts-expect-error
            route.responses[result.status]?.parse(json)
          : json,
      headers: result.headers,
    };
  }

  if (contentType?.includes("text/plain")) {
    return {
      status: result.status,
      body: await result.text(),
      headers: result.headers,
    };
  }

  return {
    status: result.status,
    body: await result.blob(),
    headers: result.headers,
  };
};

const apiClient = initClient(contract, {
  baseUrl: apiBaseUrl,
  baseHeaders: {},
  api: async (args) => {
    const auth = getAuthToken();

    args.headers["Authorization"] = `Bearer ${auth?.access_token ?? null}`;

    if (!args.contentType) {
      args.contentType = "application/json";
      args.headers["Content-Type"] = args.contentType;
    }
    return customFetchApi(args);
  },
});

export { apiClient };
