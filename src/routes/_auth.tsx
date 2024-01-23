import React from "react";
import { FileRoute, Outlet } from "@tanstack/react-router";

import { LogoutDialog } from "@/components/common/logout-dialog";
import { HeaderLayout } from "@/components/header/header-layout";

import { getAuthFromRouterContext } from "@/utils/auth";
import { LS_OIDC_REDIRECT_URI_KEY } from "@/utils/constants";
import {
  fetchClientProfileOptions,
  fetchFeaturesForClientOptions,
  fetchScreenSettingsForClientOptions,
} from "@/utils/query/client";
import {
  fetchPermissionsByUserIdOptions,
  fetchUserByIdOptions,
} from "@/utils/query/user";
import { removeTrailingSlash } from "@/utils/random";

import { Container } from "./-components/container";

export const Route = new FileRoute("/_auth").createRoute({
  beforeLoad: async ({ context, location }) => {
    const auth = getAuthFromRouterContext(context);

    const isAuthenticated = context.auth.isAuthenticated;
    const user = context.auth.user;
    const isAuthExpired = (user?.expires_at || 0) > Date.now();

    if (
      (!user || isAuthExpired || !isAuthenticated || auth.clientId === "") &&
      !context.auth.isLoading
    ) {
      const path =
        location.href && location.href === "/"
          ? "/"
          : removeTrailingSlash(location.href);

      window.localStorage.setItem(LS_OIDC_REDIRECT_URI_KEY, path);
      await context.auth.signinRedirect();
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
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <React.Fragment>
      <LogoutDialog />
      <HeaderLayout />
      <Container>
        <Outlet />
      </Container>
    </React.Fragment>
  );
}
