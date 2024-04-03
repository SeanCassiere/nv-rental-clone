import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { fetchReportsListOptions } from "@/lib/query/report";

import { Container } from "@/routes/-components/container";

import { getAuthFromRouterContext } from "@/lib/utils/auth";
import { titleMaker } from "@/lib/utils/title-maker";

import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_auth/(reports)/reports/")({
  validateSearch: (search) =>
    z
      .object({
        category: z.string().default("all").catch("all").optional(),
      })
      .parse(search),
  preSearchFilters: [(curr) => ({ category: curr?.category })],
  beforeLoad: ({ context }) => {
    const auth = getAuthFromRouterContext(context);
    return {
      authParams: auth,
      searchListOptions: fetchReportsListOptions({ auth }),
    };
  },
  loader: async ({ context }) => {
    const { queryClient, searchListOptions } = context;

    if (!context.auth.isAuthenticated) return;

    await queryClient.ensureQueryData(searchListOptions);

    return;
  },
  loaderDeps: ({ search: { category } }) => ({ category }),
  component: ReportSearchPage,
});

const ReportsList = React.lazy(() => import("./-components/reports-list"));

function ReportSearchPage() {
  const { t } = useTranslation();
  const ALL_KEY = t("display.all", { ns: "labels" });

  const category = Route.useSearch({
    select: (s) => (typeof s?.category === "undefined" ? ALL_KEY : s.category),
  });

  useDocumentTitle(titleMaker("Reports"));

  return (
    <Container>
      <section
        className={cn(
          "mx-auto mt-6 flex max-w-full flex-col gap-2 px-2 sm:mx-4 sm:px-1"
        )}
      >
        <div className={cn("flex min-h-[2.5rem] items-center justify-between")}>
          <h1 className="h-full text-2xl font-semibold leading-6">Reports</h1>
        </div>
        <p className={cn("text-base text-foreground/80")}>
          Select and run a report from the list available to you.
        </p>
      </section>

      <ReportsList
        currentCategory={category}
        internationalization={{ all: ALL_KEY }}
      />
    </Container>
  );
}
