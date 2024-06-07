import * as React from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { isUserValid } from "@/lib/utils/auth";
import { LS_OIDC_REDIRECT_URI_KEY } from "@/lib/utils/constants";

const DEFAULT_REDIRECT_URL = "/";

export const Route = createFileRoute("/_public/login")({
  validateSearch: z.object({
    redirect_url: z.string().optional(),
  }).parse,
  loaderDeps: ({ search }) => ({
    redirect_url: search.redirect_url,
  }),
  loader: ({ deps, preload, context }) => {
    const redirect_url = deps.redirect_url || DEFAULT_REDIRECT_URL;

    if (preload) {
      return {
        redirect_url,
      };
    }

    if (isUserValid(context.auth.user, context.auth.isAuthenticated)) {
      throw redirect({
        to: redirect_url,
      });
    }

    window.localStorage.setItem(LS_OIDC_REDIRECT_URI_KEY, redirect_url);

    return {
      redirect_url,
    };
  },
  component: LoginPage,
});

function LoginPage() {
  const redirect_url = Route.useLoaderData({
    select: (s) => s.redirect_url,
  });

  const auth = useAuth();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleLogin = async () => {
    window.localStorage.setItem(LS_OIDC_REDIRECT_URI_KEY, redirect_url);

    setIsSubmitting(true);

    try {
      await auth.signinRedirect();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid h-dvh w-dvw grid-cols-2">
      <section className="flex items-center justify-center">
        <Card>
          <CardContent>
            <Button type="button" onClick={handleLogin} disabled={isSubmitting}>
              <span>Login</span>
            </Button>
          </CardContent>
        </Card>
      </section>
      <section>Marketing content</section>
    </main>
  );
}
