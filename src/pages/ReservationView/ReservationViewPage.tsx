import { lazy, useMemo } from "react";
import {
  useNavigate,
  useRouter,
  useParams,
  useSearch,
  Link,
} from "@tanstack/router";
import {
  MoreVerticalIcon,
  PencilIcon,
  PrinterIcon,
  MailPlusIcon,
  BanIcon,
  MoveDownLeftIcon,
  CopyIcon,
  ChevronRightIcon,
} from "lucide-react";

import Protector from "@/components/Protector";
import {
  ChevronRightOutline,
  PencilIconFilled,
  PrintIconFilled,
} from "@/components/icons";
import {
  type ModuleTabConfigItem,
  ModuleTabs,
} from "@/components/primary-module/ModuleTabs";
import ReservationStatBlock from "@/components/primary-module/statistic-block/reservation-stat-block";
import { Separator } from "@/components/ui/separator";
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

import {
  editReservationByIdRoute,
  viewReservationByIdRoute,
} from "@/routes/reservations/reservationIdPath";

import { useGetReservationData } from "@/hooks/network/reservation/useGetReservationData";
import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";

import { getStartingIndexFromTabName } from "@/utils/moduleTabs";
import { titleMaker } from "@/utils/title-maker";
import { cn } from "@/utils";

const SummaryTab = lazy(
  () => import("../../components/Reservation/ReservationSummaryTab")
);
const ModuleNotesTabContent = lazy(
  () => import("../../components/primary-module/ModuleNotesTabContent")
);

function ReservationViewPage() {
  const router = useRouter();
  const params = useParams();

  const { tab: tabName = "summary" } = useSearch({
    from: viewReservationByIdRoute.id,
  });

  const navigate = useNavigate({ from: viewReservationByIdRoute.id });

  const reservationId = params.reservationId || "";

  const tabsConfig: ModuleTabConfigItem[] = useMemo(() => {
    const tabs: ModuleTabConfigItem[] = [];

    tabs.push({
      id: "summary",
      label: "Summary",
      component: <SummaryTab reservationId={reservationId} />,
    });
    tabs.push({
      id: "notes",
      label: "Notes",
      component: (
        <ModuleNotesTabContent
          module="reservations"
          referenceId={reservationId}
        />
      ),
    });
    tabs.push({
      id: "payments",
      label: "Payments",
      component: "Payments Tab",
    });
    tabs.push({
      id: "invoices",
      label: "Invoices",
      component: "Invoices Tab",
    });

    return tabs;
  }, [reservationId]);

  const handleFindError = () => {
    router.history.go(-1);
  };

  const onTabClick = (newTab: ModuleTabConfigItem) => {
    navigate({
      to: viewReservationByIdRoute.to,
      search: (others) => ({ ...others, tab: newTab.id }),
      params: { reservationId },
      replace: true,
    });
  };

  const reservation = useGetReservationData({
    reservationId,
    onError: handleFindError,
  });

  useDocumentTitle(
    titleMaker(
      (reservation.data?.reservationview.reservationNumber || "Loading") +
        " - Reservations"
    )
  );

  return (
    <Protector>
      <section
        className={cn(
          "mx-auto mt-6 flex max-w-full flex-col gap-2 px-2 pt-1.5 sm:mx-4 sm:px-1"
        )}
      >
        <div
          className={cn(
            "flex min-h-[2.5rem] flex-col items-center justify-between gap-4 sm:flex-row"
          )}
        >
          <div className="flex w-full items-center justify-start gap-2">
            <Link
              className="text-2xl font-semibold leading-6 text-primary"
              onClick={() => {
                router.history.go(-1);
              }}
            >
              Reservations
            </Link>
            <ChevronRightIcon
              className="h-4 w-4 flex-shrink-0 text-primary"
              aria-hidden="true"
            />
            <Link
              to={viewReservationByIdRoute.to}
              search={(current) => ({ tab: current?.tab || "summary" })}
              params={{ reservationId }}
              className="max-w-[230px] truncate text-2xl font-semibold leading-6 text-primary/80 md:max-w-full"
            >
              {reservation?.data?.reservationview?.reservationNumber}
            </Link>
          </div>
          <div className="flex w-full gap-2 sm:w-max">
            <Link
              search={() => ({ stage: "rental-information" })}
              to={editReservationByIdRoute.to}
              params={{ reservationId: String(reservationId) }}
              className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
            >
              <PencilIcon className="mr-2 h-4 w-4" />
              <span className="inline-block">Edit</span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  type="button"
                  className="flex items-center justify-center gap-2"
                  variant="ghost"
                >
                  <MoreVerticalIcon className="mr-0.5 h-4 w-4" />
                  <span className="inline-block">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>More actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <CopyIcon className="mr-2 h-4 w-4 sm:mr-4" />
                    <span>Copy and create</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <PrinterIcon className="mr-2 h-4 w-4 sm:mr-4" />
                    <span>Print</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MailPlusIcon className="mr-2 h-4 w-4 sm:mr-4" />
                    <span>Email</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className={cn("text-base text-primary/80")}>
          View the details related to this booking.
        </p>
        <Separator className="mb-3.5 mt-3.5" />
        <ReservationStatBlock reservation={reservation.data} />
      </section>

      <section
        className={cn(
          "mx-auto my-4 flex max-w-full flex-col gap-2 px-2 sm:mx-4 sm:my-6 sm:px-1"
        )}
      >
        <ModuleTabs
          tabConfig={tabsConfig}
          startingIndex={getStartingIndexFromTabName(tabName, tabsConfig)}
          onTabClick={onTabClick}
        />
      </section>
    </Protector>
  );
}

export default ReservationViewPage;
