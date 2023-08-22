import { Suspense } from "react";
import { Outlet, RouterContext } from "@tanstack/router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useAuth } from "react-oidc-context";

import { HeaderLayout } from "@/components/header/header-layout";
import { HiddenFeatureSetter } from "@/components/hidden-feature-setter";
import { LoadingPlaceholder } from "@/components/loading-placeholder";

import { UserProfileSchema } from "@/schemas/user";

import { getAuthToken } from "@/utils/authLocal";
import {
  UI_APPLICATION_SHOW_ROUTER_DEVTOOLS,
  USER_STORAGE_KEYS,
} from "@/utils/constants";
import { clientQKeys, userQKeys } from "@/utils/query-key";
import { setLocalStorageForUser } from "@/utils/user-local-storage";

import { apiClient } from "@/api";
import { queryClient } from "@/tanstack-query-config";

interface MyRouterContext {
  apiClient: typeof apiClient;
  queryClient: typeof queryClient;
}

const routerContext = new RouterContext<MyRouterContext>();

export const rootRoute = routerContext.createRootRoute({
  loader: async () => {
    const auth = getAuthToken();

    if (auth) {
      const promises = [];

      // current client's profile
      promises.push(
        queryClient.ensureQueryData({
          queryKey: clientQKeys.profile(),
          queryFn: () =>
            apiClient
              .getClientProfile({
                params: { clientId: auth.profile.navotar_clientid },
              })
              .then((res) => {
                if (res.status === 200) {
                  const currency = res.body.currency || "USD";

                  setLocalStorageForUser(
                    auth.profile.navotar_clientid,
                    auth.profile.navotar_userid,
                    USER_STORAGE_KEYS.currency,
                    currency
                  );
                }
                return res;
              }),
          staleTime: 1000 * 30, // 30 seconds
        })
      );

      // current client's feature configurations
      promises.push(
        queryClient.ensureQueryData({
          queryKey: clientQKeys.features(),
          queryFn: () =>
            apiClient.getClientFeatures({
              params: { clientId: auth.profile.navotar_clientid },
              body: {},
            }),
          staleTime: 1000 * 60 * 5, // 5 minutes
        })
      );

      // current client screen settings configurations
      promises.push(
        queryClient.ensureQueryData({
          queryKey: clientQKeys.screenSettings(),
          queryFn: () =>
            apiClient.getClientScreenSettings({
              params: { clientId: auth.profile.navotar_clientid },
            }),
          staleTime: 1000 * 60 * 5, // 5 minutes
        })
      );

      // current user's profile
      promises.push(
        queryClient.ensureQueryData({
          queryKey: userQKeys.me(),
          queryFn: () =>
            apiClient
              .getUserProfileById({
                params: { userId: auth.profile.navotar_userid },
                query: {
                  clientId: auth.profile.navotar_clientid,
                  userId: auth.profile.navotar_userid,
                  currentUserId: auth.profile.navotar_userid,
                },
              })
              .then((res) => {
                if (res.status === 200) {
                  res.body = UserProfileSchema.parse(res.body);
                }
                return res;
              }),
          staleTime: 1000 * 60 * 1, // 1 minute
        })
      );

      // current user's permissions
      promises.push(
        queryClient.ensureQueryData({
          queryKey: userQKeys.permissions(auth.profile.navotar_userid),
          queryFn: () =>
            apiClient.getUserPermissionByUserId({
              params: { userId: auth.profile.navotar_userid },
              query: { clientId: auth.profile.navotar_clientid },
            }),
          staleTime: 1000 * 60 * 5, // 5 minutes
        })
      );

      try {
        await Promise.all(promises);
      } catch (error) {
        console.log("error fetching data in the root route", error);
      }
    }

    return {};
  },
  component: RootComponent,
});

function RootComponent() {
  const auth = useAuth();

  const isHeaderShown = auth.isAuthenticated;
  const isFreshAuthenticating = auth.isLoading && !auth.isAuthenticated;

  return (
    <>
      {isHeaderShown && <HeaderLayout />}
      <main className="mx-auto w-full max-w-[1700px] flex-1 px-1 md:px-10">
        {isFreshAuthenticating ? (
          <LoadingPlaceholder />
        ) : (
          <>
            <HiddenFeatureSetter />
            <Suspense fallback={<LoadingPlaceholder />}>
              <Outlet />
            </Suspense>
          </>
        )}
        {UI_APPLICATION_SHOW_ROUTER_DEVTOOLS === true && (
          <TanStackRouterDevtools position="top-right" />
        )}
      </main>
    </>
  );
}
