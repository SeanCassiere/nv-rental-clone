import { Link, NotFoundRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Route as rootRoute } from "@/routes/__root";

import { cn } from "@/lib/utils";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <section
      className={cn(
        "mx-auto mt-6 flex max-w-full flex-col gap-2 px-2 pt-1.5 sm:px-4 sm:pb-2"
      )}
    >
      <div className="my-auto flex-shrink-0 sm:py-32">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {t("labelError", { ns: "messages", label: 404 })}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {t("pageNotFound", { ns: "messages" })}
        </h1>
        <p className="mt-2 text-base text-foreground/80">
          {t("sorryCouldNotFindThatPage", { ns: "messages" })}
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="text-base font-medium text-primary hover:text-primary/80"
          >
            <span aria-hidden="true">&larr; </span>
            {t("goBack", { ns: "messages", context: "dashboard" })}
          </Link>
        </div>
      </div>
    </section>
  );
};

export const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: NotFoundPage,
});
