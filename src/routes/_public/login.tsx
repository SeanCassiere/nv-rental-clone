import * as React from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { isUserValid } from "@/lib/utils/auth";
import {
  LS_OIDC_REDIRECT_URI_KEY,
  UI_APPLICATION_NAME,
} from "@/lib/utils/constants";
import { titleMaker } from "@/lib/utils/title-maker";

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
  const auth = useAuth();
  const { t } = useTranslation();

  const redirect_url = Route.useLoaderData({
    select: (s) => s.redirect_url,
  });

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

  useDocumentTitle(titleMaker(t("pageTitle", { ns: "login" })));

  return (
    <main className="grid h-dvh w-dvw bg-background lg:grid-cols-2 xl:grid-cols-3">
      <section className="flex flex-col justify-between p-4 md:col-span-1">
        <div className="mx-auto flex w-full max-w-[800px] items-center justify-start gap-2">
          <img
            className="h-10 w-10 rounded-full p-1 [content:var(--logo-url)]"
            alt={UI_APPLICATION_NAME}
            style={{ imageRendering: "crisp-edges" }}
          />
          <p className="select-none text-lg font-medium leading-3">
            {UI_APPLICATION_NAME}
          </p>
        </div>
        <Card className="mx-auto w-full max-w-md shadow-inner">
          <CardHeader className="mb-2">
            <CardTitle className="mb-2">
              {t("title", { ns: "login" })}
            </CardTitle>
            <CardDescription className="max-w-sm">
              {t("description", { ns: "login", appName: UI_APPLICATION_NAME })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              type="button"
              className="w-full text-base"
              size="lg"
              onClick={handleLogin}
              disabled={isSubmitting}
            >
              <span>
                {t("submitBtn", { ns: "login", appName: UI_APPLICATION_NAME })}
              </span>
            </Button>
          </CardContent>
        </Card>
        <div className="mx-auto w-full max-w-[800px]">
          <p className="text-sm font-medium tracking-tight text-muted-foreground">
            © {UI_APPLICATION_NAME} ({new Date().getFullYear()})
          </p>
        </div>
      </section>
      <section className="hidden py-4 lg:col-span-1 lg:grid lg:place-items-center xl:col-span-2">
        <div className="size-full rounded-l-2xl bg-secondary p-4" />
      </section>
    </main>
  );
}
