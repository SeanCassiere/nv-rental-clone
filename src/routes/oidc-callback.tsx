/* eslint react-hooks/rules-of-hooks: 0 */
import { useEffect } from "react";
import { Route } from "@tanstack/router";
import { hasAuthParams, useAuth } from "react-oidc-context";
import { z } from "zod";

import { rootRoute } from "./__root";
import LoadingPlaceholder from "@/components/loading-placeholder";
import { LS_OIDC_REDIRECT_URI_KEY } from "@/utils/constants";
import { router } from "@/router.config";

export const oidcCallbackRoute = new Route({
  getParentRoute: () => rootRoute,
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  path: "oidc-callback",
  component: ({ useSearch }) => {
    const auth = useAuth();
    const search = useSearch();

    useEffect(() => {
      // if there are no auth params, begin the sign-in process
      if (!hasAuthParams() && typeof search.redirect !== "undefined") {
        window.localStorage.setItem(LS_OIDC_REDIRECT_URI_KEY, search.redirect);
        auth.signinRedirect();
        return;
      }

      // if execution gets to here that means we have auth params and should look at redirection
      const storedRedirectUri = window.localStorage.getItem(
        LS_OIDC_REDIRECT_URI_KEY
      );
      if (
        storedRedirectUri &&
        storedRedirectUri !== "" &&
        storedRedirectUri !== "/"
      ) {
        router.navigate({
          to: storedRedirectUri as any,
        });
        return;
      }

      router.navigate({ to: "/" });
    }, [auth, search.redirect]);

    return <LoadingPlaceholder />;
  },
});
