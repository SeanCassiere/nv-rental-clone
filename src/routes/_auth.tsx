import React from "react";
import {
  createFileRoute,
  Outlet,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

import {
  fetchClientProfileOptions,
  fetchFeaturesForClientOptions,
  fetchScreenSettingsForClientOptions,
} from "@/lib/query/client";
import {
  fetchPermissionsByUserIdOptions,
  fetchUserByIdOptions,
} from "@/lib/query/user";

import { getAuthFromRouterContext, isValidUser } from "@/lib/utils/auth";
import { LS_OIDC_REDIRECT_URI_KEY } from "@/lib/utils/constants";

import { useConfigureLocalFeatures } from "./-components/auth/useConfigureLocalFeatures";

const AuthHeader = React.lazy(() => import("@/routes/-components/auth/header"));
const LogoutDialog = React.lazy(
  () => import("@/routes/-components/auth/logout-dialog")
);

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ context, location, preload }) => {
    const navigator = context.auth.activeNavigator;

    if (preload) {
      return;
    }

    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect_url: location.href,
        },
      });
    }

    if (
      navigator !== "signinSilent" &&
      navigator !== "signinRedirect" &&
      !isValidUser(context.auth.user)
    ) {
      window.localStorage.setItem(LS_OIDC_REDIRECT_URI_KEY, location.href);

      await context.auth.signinRedirect();
      return;
    }

    return;
  },
  loader: async ({ context }) => {
    const { queryClient } = context;
    const auth = getAuthFromRouterContext(context);

    if (!context.auth.isAuthenticated) return;

    const promises = [];

    // current client's profile
    promises.push(
      queryClient.ensureQueryData(fetchClientProfileOptions({ auth }))
    );

    // current client's feature configurations
    promises.push(
      queryClient.ensureQueryData(fetchFeaturesForClientOptions({ auth }))
    );

    // current client screen settings configurations
    promises.push(
      queryClient.ensureQueryData(fetchScreenSettingsForClientOptions({ auth }))
    );

    // current user's profile
    promises.push(
      queryClient.ensureQueryData(
        fetchUserByIdOptions({ auth, userId: auth.userId })
      )
    );

    // current user's permissions
    promises.push(
      queryClient.ensureQueryData(
        fetchPermissionsByUserIdOptions({ auth, userId: auth.userId })
      )
    );

    await Promise.all(promises);
  },
  component: AuthLayout,
});

function AuthLayout() {
  const auth = useAuth();
  const redirectUri = useRouterState({ select: (s) => s.location.href });

  useConfigureLocalFeatures();

  React.useEffect(() => {
    return auth.events.addAccessTokenExpiring(() => {
      window.localStorage.setItem(LS_OIDC_REDIRECT_URI_KEY, redirectUri);
      auth.signinSilent();
    });
  }, [auth, auth.events, auth.signinSilent, redirectUri]);

  React.useEffect(() => {
    return auth.events.addAccessTokenExpired(() => {
      window.localStorage.setItem(LS_OIDC_REDIRECT_URI_KEY, redirectUri);
      auth.signinRedirect();
    });
  }, [auth, auth.events, auth.signinRedirect, redirectUri]);

  React.useEffect(() => {
    return auth.events.addSilentRenewError((error) => {
      console.error("🔐 ~ Auth silent renew error: ", error);
      auth.signoutRedirect();
    });
  }, [auth, auth.events]);

  return (
    <React.Fragment>
      <LogoutDialog />
      <AuthHeader />
      <Outlet />
    </React.Fragment>
  );
}
