import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  useChildMatches,
} from "@tanstack/react-router";

import ReservationStatBlock from "@/components/primary-module/statistic-block/reservation-stat-block";
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
  "/_auth/(reservations)/reservations/$reservationId/_details"
)({
  component: Component,
});

function Component() {
  const { viewReservationOptions } = Route.useRouteContext();
  const { reservationId } = Route.useParams();

  const childMatches = useChildMatches();

  const currentTab = React.useMemo(() => {
    const firstMatch = childMatches[0];

    if (!firstMatch) return "summary";
    const pathname = firstMatch.pathname;

    if (pathname.endsWith("notes")) return "notes";

    return "summary";
  }, [childMatches]);

  const reservationData = useSuspenseQuery(viewReservationOptions);
  const reservation =
    reservationData.data?.status === 200 ? reservationData.data?.body : null;

  useDocumentTitle(
    titleMaker(
      (reservation?.reservationview.reservationNumber || "Loading") +
        " - Reservations"
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
                from="/reservations/$reservationId"
                to=".."
                className="text-2xl font-semibold leading-6"
              >
                Reservations
              </Link>
              <icons.ChevronRight
                className="h-4 w-4 flex-shrink-0"
                aria-hidden="true"
              />
              <Link
                to="/reservations/$reservationId"
                search={(current) => ({
                  tab:
                    "tab" in current && typeof current.tab === "string"
                      ? current.tab
                      : "summary",
                })}
                params={{ reservationId }}
                className="max-w-[230px] truncate text-2xl font-semibold leading-6 text-foreground/80 md:max-w-full"
              >
                {reservation?.reservationview?.reservationNumber}
              </Link>
            </div>
            <div className="flex w-full gap-2 sm:w-max">
              <Link
                to="/reservations/$reservationId/edit"
                search={() => ({ stage: "rental-information" })}
                params={{ reservationId: String(reservationId) }}
                className={cn(
                  buttonVariants({ size: "sm", variant: "outline" })
                )}
              >
                <icons.Edit className="mr-2 h-4 w-4" />
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
                    <DropdownMenuItem>
                      <icons.Copy className="mr-2 h-4 w-4 sm:mr-4" />
                      <span>Copy and create</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <icons.Print className="mr-2 h-4 w-4 sm:mr-4" />
                      <span>Print</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <icons.MailPlus className="mr-2 h-4 w-4 sm:mr-4" />
                      <span>Email</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <p className={cn("text-base text-foreground/80")}>
            View the details related to this booking.
          </p>
        </div>
      </Container>
      <Separator />
      <Container as="div">
        <ReservationStatBlock
          reservation={reservation}
          className="px-2 sm:px-4"
        />
      </Container>
      <Container as="div" className="overflow-hidden">
        <Tabs defaultValue={currentTab} className="overflow-x-auto">
          <TabsList className="mx-2 sm:mx-4">
            <TabsTrigger value="summary" asChild>
              <Link
                from="/reservations/$reservationId"
                to="/reservations/$reservationId/summary"
              >
                Summary
              </Link>
            </TabsTrigger>
            <TabsTrigger value="notes" asChild>
              <Link
                from="/reservations/$reservationId"
                to="/reservations/$reservationId/notes"
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
