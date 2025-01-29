import React from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { buttonVariants } from "@/components/ui/button";
import { icons } from "@/components/ui/icons";

import { cn } from "@/lib/utils";

function PageNotFound({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <section
        className={cn(
          "flex grow flex-col items-center justify-center gap-2",
          className
        )}
      >
        <p className="text-primary text-sm font-semibold tracking-wide uppercase">
          {t("labelError", { ns: "messages", label: 404 })}
        </p>
        <h1 className="text-foreground mt-2 text-2xl font-semibold tracking-tight sm:text-4xl">
          {t("pageNotFound", { ns: "messages" })}
        </h1>
        <p className="text-foreground/80 mt-2 text-center text-base">
          {t("sorryCouldNotFindThatPage", { ns: "messages" })}
        </p>
        {children || (
          <p className="mt-4">
            <Link to="/" className={cn(buttonVariants())}>
              <icons.ChevronLeft className="mr-2 h-4 w-4" />
              <span>
                {t("goBack", { ns: "messages", context: "dashboard" })}
              </span>
            </Link>
          </p>
        )}
      </section>
    </React.Fragment>
  );
}

export { PageNotFound };
