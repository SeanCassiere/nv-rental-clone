import { createFileRoute, redirect } from "@tanstack/react-router";
import { hasAuthParams } from "react-oidc-context";
import { z } from "zod";

import { Container } from "@/routes/-components/container";
import { LoadingPlaceholder } from "@/routes/-components/loading-placeholder";

import { LS_OIDC_REDIRECT_URI_KEY } from "@/lib/utils/constants";

export const Route = createFileRoute("/_public/oidc-callback")({
  validateSearch: z.object({
    redirect: z.string().optional(),
    code: z.string().optional(),
    scope: z.string().optional(),
    state: z.string().optional(),
    session_state: z.string().optional(),
  }),
  loaderDeps: ({ search }) => ({
    redirect: search?.redirect,
    code: search?.code,
    scope: search?.scope,
    state: search?.state,
    session_state: search?.session_state,
  }),
  beforeLoad: ({ search }) => ({ search }),
  loader: async ({ context, preload, location }) => {
    const locationPathname = location.pathname;
    if (preload || !locationPathname.includes("oidc-callback")) return;

    const auth = context.auth;
    const search = context.search;
    const redirectPath = search?.redirect ?? null;

    const routerLocation = location;

    const isAuthParams = hasAuthParams({
      ancestorOrigins: window.location.ancestorOrigins,
      host: window.location.host,
      origin: window.location.origin,
      hostname: window.location.hostname,
      port: window.location.port,
      protocol: window.location.protocol,
      replace: window.location.replace,
      assign: window.location.assign,
      reload: window.location.reload,
      pathname: routerLocation.pathname,
      hash: routerLocation.hash,
      href: routerLocation.href,
      search: routerLocation.searchStr,
    });

    // if there are no auth params, begin the sign-in process
    if (!isAuthParams) {
      const safeRoute = redirectPath ?? "/";

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
      to: pathname || "/",
      search: searchParamsObj,
    });
  },
  component: function PageComponent() {
    return (
      <Container>
        <LoadingPlaceholder />
      </Container>
    );
  },
});
