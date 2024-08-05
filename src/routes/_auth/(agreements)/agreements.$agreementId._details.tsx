import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  useChildMatches,
} from "@tanstack/react-router";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { icons } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import AgreementStatBlock from "@/routes/_auth/-modules/statistic-block/agreement-stat-block";
import { Container } from "@/routes/-components/container";

import { titleMaker } from "@/lib/utils/title-maker";

import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/_auth/(agreements)/agreements/$agreementId/_details"
)({
  component: Component,
});

function Component() {
  const { viewAgreementOptions } = Route.useRouteContext();
  const { agreementId } = Route.useParams();

  const childMatches = useChildMatches();

  const currentTab = React.useMemo(() => {
    const firstMatch = childMatches[0];

    if (!firstMatch) return "summary";
    const pathname = firstMatch.pathname;

    if (pathname.endsWith("exchanges")) return "exchanges";
    if (pathname.endsWith("notes")) return "notes";

    return "summary";
  }, [childMatches]);

  const agreementQuery = useSuspenseQuery(viewAgreementOptions);
  const agreement =
    agreementQuery.data?.status === 200 ? agreementQuery.data.body : null;
  const isCheckedIn = agreement?.returnDate ? true : false;

  useDocumentTitle(
    titleMaker((agreement?.agreementNumber || "Loading") + " - Agreements")
  );

  return (
    <article className="mt-6 grid gap-5">
      <Container as="div">
        <div className={cn("grid max-w-full gap-2 px-4 sm:px-5")}>
          <div
            className={cn(
              "flex min-h-[2.5rem] flex-col items-center justify-between gap-4 sm:flex-row"
            )}
          >
            <div className="flex w-full items-center justify-start gap-2">
              <Link
                from="/agreements/$agreementId"
                to=".."
                className="text-2xl font-semibold leading-6"
              >
                Agreements
              </Link>
              <icons.ChevronRight
                className="h-4 w-4 flex-shrink-0"
                aria-hidden="true"
              />
              <Link
                to="/agreements/$agreementId/summary"
                search={(current) => ({
                  ...current,
                  tab:
                    "tab" in current && typeof current.tab === "string"
                      ? current.tab
                      : "summary",
                })}
                params={{ agreementId }}
                className="max-w-[230px] truncate text-2xl font-semibold leading-6 text-foreground/80 md:max-w-full"
              >
                {agreement?.agreementNumber}
              </Link>
            </div>
            <div className="flex w-full gap-2 sm:w-max">
              {!isCheckedIn && (
                <Link
                  to="/agreements/$agreementId/check-in"
                  search={() => ({ stage: "rental-information" })}
                  params={{ agreementId: String(agreementId) }}
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  <icons.Checkin className="mr-2 h-4 w-4" />
                  <span className="inline-block">Checkin</span>
                </Link>
              )}
              {isCheckedIn ? (
                <Link
                  to="/agreements/$agreementId/check-in"
                  search={() => ({ stage: "rental-information" })}
                  params={{ agreementId: String(agreementId) }}
                  className={cn(
                    buttonVariants({ size: "sm", variant: "outline" })
                  )}
                >
                  <icons.Edit className="mr-2 h-4 w-4" />
                  <span className="inline-block">Edit</span>
                </Link>
              ) : (
                <Link
                  to="/agreements/$agreementId/edit"
                  search={() => ({ stage: "rental-information" })}
                  params={{ agreementId: String(agreementId) }}
                  className={cn(
                    buttonVariants({ size: "sm", variant: "outline" })
                  )}
                >
                  <icons.Edit className="mr-2 h-4 w-4" />
                  <span className="inline-block">Edit</span>
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    type="button"
                    className="flex items-center justify-center gap-2"
                    variant="outline"
                  >
                    <icons.More className="h-4 w-4" />
                    <span className="sr-only inline-block">More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>More actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <icons.Print className="mr-2 h-4 w-4 sm:mr-4" />
                      <span>Print</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <icons.MailPlus className="mr-2 h-4 w-4 sm:mr-4" />
                      <span>Email</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <icons.Clear className="mr-2 h-4 w-4 sm:mr-4" />
                      <span>Void</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <p className={cn("text-base text-foreground/80")}>
            View the details related to this rental.
          </p>
        </div>
      </Container>
      <Separator />
      <Container as="div">
        <AgreementStatBlock
          agreement={agreement}
          isCheckedIn={isCheckedIn}
          className="px-2 sm:px-4"
        />
      </Container>
      <Container as="div" className="overflow-hidden">
        <Tabs
          key={`details_tab_${currentTab}`}
          defaultValue={currentTab}
          className="overflow-x-auto"
        >
          <TabsList className="mx-2 sm:mx-4">
            <TabsTrigger value="summary" asChild>
              <Link
                from="/agreements/$agreementId"
                to="/agreements/$agreementId/summary"
                resetScroll={false}
              >
                Summary
              </Link>
            </TabsTrigger>
            <TabsTrigger value="notes" asChild>
              <Link
                from="/agreements/$agreementId"
                to="/agreements/$agreementId/notes"
                resetScroll={false}
              >
                Notes
              </Link>
            </TabsTrigger>
            <TabsTrigger value="exchanges" asChild>
              <Link
                from="/agreements/$agreementId"
                to="/agreements/$agreementId/exchanges"
                resetScroll={false}
              >
                Exchanges
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Container>
      <Outlet />
    </article>
  );
}
