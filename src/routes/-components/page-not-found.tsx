import React from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { buttonVariants } from "@/components/ui/button";
import { icons } from "@/components/ui/icons";

import { cn } from "@/lib/utils";

import { RouterDevTools } from "./router-devtools";

function PageNotFound({
  children,
  renderRouterDevtools = false,
}: {
  children?: React.ReactNode;
  renderRouterDevtools?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <section
        className={cn("flex grow flex-col items-center justify-center gap-2")}
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {t("labelError", { ns: "messages", label: 404 })}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {t("pageNotFound", { ns: "messages" })}
        </h1>
        <p className="mt-2 text-base text-foreground/80">
          {t("sorryCouldNotFindThatPage", { ns: "messages" })}
        </p>
        {children || (
          <p className="mt-6">
            <Link to="/" className={cn(buttonVariants())} preload={false}>
              <icons.ChevronLeft className="mr-2 h-4 w-4" />
              <span>
                {t("goBack", { ns: "messages", context: "dashboard" })}
              </span>
            </Link>
          </p>
        )}
      </section>
      {renderRouterDevtools ? <RouterDevTools position="bottom-left" /> : null}
    </React.Fragment>
  );
}

export { PageNotFound };
