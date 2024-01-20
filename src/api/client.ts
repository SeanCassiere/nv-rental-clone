import { initClient, tsRestFetchApi } from "@ts-rest/core";

import { contract } from "@/api/_root.contract";

import { getAuthFromOidcStorage } from "@/utils/auth";
import { apiBaseUrl } from "@/utils/constants";

const apiClient = initClient(contract, {
  baseUrl: apiBaseUrl,
  baseHeaders: {},
  api: async (args) => {
    const auth = getAuthFromOidcStorage();

    args.headers["Authorization"] = `Bearer ${auth?.access_token ?? null}`;

    return tsRestFetchApi(args);
  },
});

export { apiClient };
