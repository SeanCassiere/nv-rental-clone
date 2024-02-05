import { initClient, tsRestFetchApi } from "@ts-rest/core";

import { contract } from "@/lib/api/_root.contract";

import { getAuthFromOidcStorage } from "@/lib/utils/auth";
import { apiBaseUrl } from "@/lib/utils/constants";

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
