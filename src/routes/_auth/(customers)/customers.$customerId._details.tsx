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

import { Container } from "@/routes/-components/container";

import { titleMaker } from "@/lib/utils/title-maker";

import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/_auth/(customers)/customers/$customerId/_details"
)({
  component: Component,
});

function Component() {
  const viewCustomerOptions = Route.useRouteContext({
    select: (s) => s.viewCustomerOptions,
  });
  const { customerId } = Route.useParams();

  const childMatches = useChildMatches();

  const currentTab = React.useMemo(() => {
    const firstMatch = childMatches[0];

    if (!firstMatch) return "summary";
    const pathname = firstMatch.pathname;

    if (pathname.endsWith("notes")) return "notes";

    return "summary";
  }, [childMatches]);

  const customerQuery = useSuspenseQuery(viewCustomerOptions);
  const customer =
    customerQuery.data?.status === 200 ? customerQuery.data.body : null;

  useDocumentTitle(
    titleMaker(
      (customer?.firstName && customer?.lastName
        ? customer?.firstName + " " + customer?.lastName
        : "Loading") + " - Customers"
    )
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
                from="/customers/$customerId"
                to=".."
                className="text-2xl leading-6 font-semibold"
              >
                Customers
              </Link>
              <icons.ChevronRight
                className="h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              <Link
                to="/customers/$customerId"
                search={(current) => ({
                  tab:
                    "tab" in current && typeof current.tab === "string"
                      ? current.tab
                      : "summary",
                })}
                params={{ customerId }}
                className="text-foreground/80 max-w-[230px] truncate text-2xl leading-6 font-semibold md:max-w-full"
              >
                {customer?.firstName}&nbsp;
                {customer?.lastName}
              </Link>
            </div>
            <div className="flex w-full gap-2 sm:w-max">
              <Link
                to="/customers/$customerId/edit"
                search={() => ({})}
                params={{ customerId: String(customerId) }}
                className={cn(
                  buttonVariants({ size: "sm", variant: "outline" })
                )}
              >
                <icons.Edit className="h-4 w-4 sm:mr-2" />
                <span className="inline-block">Edit</span>
              </Link>

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
                    {customer?.active ? (
                      <DropdownMenuItem>
                        <icons.Deactivate className="mr-2 h-4 w-4 sm:mr-4" />
                        <span>Deactivate</span>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>
                        <icons.Activate className="mr-2 h-4 w-4 sm:mr-4" />
                        <span>Activate</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <p className={cn("text-foreground/80 text-base")}>
            View the details related to this customer.
          </p>
        </div>
      </Container>
      <Separator />
      <Container as="div" className="overflow-hidden">
        <Tabs
          key={`details_tab_${currentTab}`}
          defaultValue={currentTab}
          className="overflow-x-auto"
        >
          <TabsList className="mx-2 sm:mx-4">
            <TabsTrigger value="summary" asChild>
              <Link
                from="/customers/$customerId"
                to="/customers/$customerId/summary"
              >
                Summary
              </Link>
            </TabsTrigger>
            <TabsTrigger value="notes" asChild>
              <Link
                from="/customers/$customerId"
                to="/customers/$customerId/notes"
              >
                Notes
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Container>
      <Outlet />
    </article>
  );
}
