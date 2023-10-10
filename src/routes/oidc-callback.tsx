import { redirect, Route } from "@tanstack/react-router";
import { hasAuthParams } from "react-oidc-context";
import { z } from "zod";

import { LoadingPlaceholder } from "@/components/loading-placeholder";

import { LS_OIDC_REDIRECT_URI_KEY } from "@/utils/constants";

import { rootRoute } from "./__root";

function removeTrailingSlash(path: string) {
  const pathParts = path.split("?");
  const pathWithoutSlash = pathParts[0]?.replace(/\/$/, "");
  return pathWithoutSlash + (pathParts[1] ? `?${pathParts[1]}` : "");
}

export const oidcCallbackRoute = new Route({
  getParentRoute: () => rootRoute,
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  path: "oidc-callback",
  loaderContext: ({ search }) => ({ redirectPath: search.redirect ?? null }),
  beforeLoad: async ({ context, preload }) => {
    if (preload) return;

    const { redirectPath, auth } = context;

    const isAuthParams = hasAuthParams();

    // if there are no auth params, begin the sign-in process
    if (!isAuthParams) {
      let safeRoute = redirectPath ?? "/";

      if (safeRoute && safeRoute !== "/") {
        safeRoute = removeTrailingSlash(safeRoute);
      }

      window.localStorage.setItem(LS_OIDC_REDIRECT_URI_KEY, safeRoute);
      await auth.signinRedirect();
      return;
    }

    // if execution gets to here that means we have auth params and should look at redirection
    const storedRedirectUri = window.localStorage.getItem(
      LS_OIDC_REDIRECT_URI_KEY
    );

    const pathname = storedRedirectUri?.split("?")[0];
    const searchParams = new URLSearchParams(
      storedRedirectUri?.split("?")[1] ?? ""
    );
    const searchParamsObj = Object.fromEntries(searchParams.entries());

    throw redirect({
      to: (pathname as any) ?? "/",
      search: searchParamsObj,
    });
  },
  component: LoadingPlaceholder,
});
