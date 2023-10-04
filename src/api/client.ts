import { initClient, tsRestFetchApi } from "@ts-rest/core";

import { contract } from "@/api/_root.contract";

import { getAuthToken } from "@/utils/authLocal";
import { apiBaseUrl } from "@/utils/constants";

const apiClient = initClient(contract, {
  baseUrl: apiBaseUrl,
  baseHeaders: {},
  api: async (args) => {
    const auth = getAuthToken();

    args.headers["Authorization"] = `Bearer ${auth?.access_token ?? null}`;

    return tsRestFetchApi(args);
  },
});

export { apiClient };
