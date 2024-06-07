import * as React from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { CircleCheckBigIcon } from "lucide-react";
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
import { icons } from "@/components/ui/icons";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";
import { useTernaryDarkMode } from "@/lib/hooks/useTernaryDarkMode";

import { isValidUser } from "@/lib/utils/auth";
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

    if (context.auth.isAuthenticated && isValidUser(context.auth.user)) {
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
  const { ternaryDarkMode, toggleTernaryDarkMode } = useTernaryDarkMode();

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
        <div className="mx-auto flex w-full max-w-[800px] items-center justify-between">
          <p className="block text-sm font-medium tracking-tight text-muted-foreground">
            © {UI_APPLICATION_NAME} ({new Date().getFullYear()})
          </p>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="p-1.5"
            onClick={() => {
              toggleTernaryDarkMode();
            }}
          >
            {(() => {
              switch (ternaryDarkMode) {
                case "system":
                  return <icons.System className="size-3.5" />;
                case "dark":
                  return <icons.Moon className="size-3.5" />;
                case "light":
                  return <icons.Sun className="size-3.5" />;
                default:
                  return null;
              }
            })()}
          </Button>
        </div>
      </section>
      <section className="relative hidden py-4 lg:col-span-1 lg:grid lg:place-items-center xl:col-span-2">
        <div className="size-full rounded-l-2xl bg-secondary p-10">
          <div
            className="absolute inset-0 size-full bg-[radial-gradient(hsla(var(--secondary-foreground)/0.25)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"
            aria-hidden
          />
          <div className="grid max-w-2xl gap-4 xl:gap-5">
            <span
              className="mb-4 grid size-14 place-items-center rounded-full border bg-background xl:mb-6 xl:size-16"
              aria-hidden
            >
              <icons.GripVertical className="size-5 text-foreground/75 xl:size-6" />
            </span>
            <h3 className="z-20 text-5xl font-medium tracking-tighter text-secondary-foreground xl:text-6xl">
              Streamline your workflow
            </h3>
            <p className="z-10 pl-0.5 tracking-wide text-secondary-foreground/90">
              Discover the ease of managing your car rental business with our
              intuitive software. From reservations to reporting, our{" "}
              {UI_APPLICATION_NAME} simplifies every step, allowing you to focus
              on delivering exceptional service to your customers.
            </p>
            <ul className="z-10 mt-4 grid gap-4">
              <li className="flex items-center gap-6 rounded-xl border bg-background/80 px-6 py-4 shadow">
                <span>
                  <CircleCheckBigIcon className="size-5 text-foreground" />
                </span>
                <h4 className="text-foreground/90">Booking Management</h4>
              </li>
              <li className="flex items-center gap-6 rounded-xl border bg-background/80 px-6 py-4 shadow">
                <span>
                  <CircleCheckBigIcon className="size-5 text-foreground" />
                </span>
                <h4 className="text-foreground/90">Fleet Management</h4>
              </li>
              <li className="flex items-center gap-6 rounded-xl border bg-background/80 px-6 py-4 shadow">
                <span>
                  <CircleCheckBigIcon className="size-5 text-foreground" />
                </span>
                <h4 className="text-foreground/90">Customer Database</h4>
              </li>
              <li className="flex items-center gap-6 rounded-xl border bg-background/80 px-6 py-4 shadow">
                <span>
                  <CircleCheckBigIcon className="size-5 text-foreground" />
                </span>
                <h4 className="text-foreground/90">Reporting and Analytics</h4>
              </li>
              <li className="flex items-center gap-6 rounded-xl border bg-background/80 px-6 py-4 shadow">
                <span>
                  <CircleCheckBigIcon className="size-5 text-foreground" />
                </span>
                <h4 className="text-foreground/90">24/7 Customer Support</h4>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
