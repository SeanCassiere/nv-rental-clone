import { lazy, useMemo } from "react";
import {
  useNavigate,
  useRouter,
  useParams,
  useSearch,
  Link,
} from "@tanstack/react-router";

import Protector from "../../components/Protector";
import {
  ChevronRightOutline,
  PencilIconFilled,
  PrintIconFilled,
} from "../../components/icons";
import {
  type ModuleTabConfigItem,
  ModuleTabs,
} from "../../components/PrimaryModule/ModuleTabs";
import ScrollToTop from "../../components/ScrollToTop";
import CommonHeader from "../../components/Layout/CommonHeader";
import ReservationModuleStatBlock from "../../components/PrimaryModule/ModuleStatBlock/ReservationModuleStatBlock";
import { Button, LinkButton } from "../../components/Form";

import {
  editReservationByIdRoute,
  viewReservationByIdRoute,
} from "../../routes/reservations/reservationIdPath";

import { useGetReservationData } from "../../hooks/network/reservation/useGetReservationData";
import { useDocumentTitle } from "../../hooks/internal/useDocumentTitle";

import { getStartingIndexFromTabName } from "../../utils/moduleTabs";
import { titleMaker } from "../../utils/title-maker";

const SummaryTab = lazy(
  () => import("../../components/Reservation/ReservationSummaryTab")
);
const ModuleNotesTabContent = lazy(
  () => import("../../components/PrimaryModule/ModuleNotesTabContent")
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
      to: viewReservationByIdRoute.fullPath,
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
      <ScrollToTop />
      <div className="py-6">
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <CommonHeader
            titleContent={
              <div className="flex flex-col justify-between gap-4 md:flex-row md:gap-0">
                <div className="flex items-center gap-2">
                  <Link
                    to=".."
                    className="select-none text-2xl font-semibold leading-6 text-gray-700 hover:text-gray-800"
                    onClick={() => {
                      router.history.go(-1);
                    }}
                  >
                    Reservations
                  </Link>
                  <ChevronRightOutline
                    className="h-4 w-4 flex-shrink-0 text-gray-500"
                    aria-hidden="true"
                  />
                  <Link
                    to={viewReservationByIdRoute.fullPath}
                    search={(current) => ({ tab: current?.tab || "summary" })}
                    params={{ reservationId }}
                    className="max-w-[230px] truncate text-xl leading-6 text-gray-800 md:max-w-full"
                  >
                    {reservation?.data?.reservationview?.reservationNumber}
                  </Link>
                </div>
                <div className="flex flex-col gap-3 md:flex-row">
                  <LinkButton
                    to={editReservationByIdRoute.fullPath}
                    search={() => ({})}
                    params={{ reservationId: String(reservationId) }}
                    className="flex items-center justify-center gap-2"
                  >
                    <PencilIconFilled className="h-3 w-3" />
                    Edit
                  </LinkButton>
                  <Button
                    type="button"
                    color="teal"
                    className="flex items-center justify-center gap-2"
                  >
                    <PrintIconFilled className="h-3 w-3" />
                    Print
                  </Button>
                </div>
              </div>
            }
            headerActionContent
          />

          <div className="my-4 mt-2 sm:mt-6">
            <ReservationModuleStatBlock reservation={reservation.data} />
          </div>
        </div>

        <div className="mx-auto px-4 sm:px-6 md:grid-cols-12 md:px-8">
          <ModuleTabs
            tabConfig={tabsConfig}
            startingIndex={getStartingIndexFromTabName(tabName, tabsConfig)}
            onTabClick={onTabClick}
          />
        </div>
      </div>
    </Protector>
  );
}

export default ReservationViewPage;
