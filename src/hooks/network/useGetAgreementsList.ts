import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchAgreementsList } from "../../api/agreements";
import { makeInitialApiData, type ResponseParsed } from "../../api/fetcher";
import type { AgreementListItemType } from "../../types/Agreement";

export function useGetAgreementsList(params: {
  page: number;
  pageSize: number;
  filters: any;
}) {
  const auth = useAuth();
  const query = useQuery<ResponseParsed<AgreementListItemType[]>>({
    queryKey: [
      "agreements",
      JSON.stringify({ page: params.page, pageSize: params.pageSize }),
      JSON.stringify(params.filters),
    ],
    queryFn: () =>
      fetchAgreementsList({
        page: params.page,
        pageSize: params.pageSize,
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        currentDate: new Date(),
        filters: params.filters,
      }).then((dataObj) => {
        const updated = dataObj.data.map((agreement: any) => ({
          ...agreement,
          id: `${agreement?.AgreementId}`,
          FullName: agreement?.FirstName + " " + agreement?.LastName, // done for columns accessors
        }));

        return { ...dataObj, data: updated };
      }),
    enabled: auth.isAuthenticated,
    initialData: makeInitialApiData([] as any[]),
  });
  return query;
}
