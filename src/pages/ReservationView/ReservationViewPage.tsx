import { lazy, useEffect } from "react";
import {
  useNavigate,
  useRouter,
  useParams,
  useSearch,
  Link,
} from "@tanstack/react-router";

import Protector from "../../components/Protector";
import { viewReservationRoute } from "../../routes/reservations/viewReservation";
import { ChevronRightOutline } from "../../components/icons";
import { useGetReservationData } from "../../hooks/network/reservation/useGetReservationData";
import {
  type ModuleTabConfigItem,
  ModuleTabs,
} from "../../components/PrimaryModule/ModuleTabs";
import ScrollToTop from "../../components/ScrollToTop";

import { getStartingIndexFromTabName } from "../../utils/moduleTabs";
import { titleMaker } from "../../utils/title-maker";

const SummaryTab = lazy(
  () => import("../../components/Reservation/ReservationSummaryTab")
);
const PaymentsTab = lazy(
  () => import("../../components/PrimaryModule/ModulePayments/Tab")
);
const InvoicesTab = lazy(
  () => import("../../components/PrimaryModule/ModuleInvoices/Tab")
);

function ReservationViewPage() {
  const router = useRouter();
  const params = useParams();

  const { tab: tabName = "summary" } = useSearch({
    from: viewReservationRoute.id,
  });

  const navigate = useNavigate({ from: viewReservationRoute.id });

  const reservationId = params.reservationId || "";

  const tabsConfig: ModuleTabConfigItem[] = [
    {
      id: "summary",
      label: "Summary",
      component: <SummaryTab reservationId={reservationId} />,
    },
    {
      id: "payments",
      label: "Payments",
      component: <PaymentsTab />,
    },
    {
      id: "invoices",
      label: "Invoices",
      component: <InvoicesTab />,
    },
  ];

  const onFindError = () => {
    router.history.go(-1);
  };

  const onTabClick = (newTab: ModuleTabConfigItem) => {
    navigate({
      to: viewReservationRoute.id,
      search: (others) => ({ ...others, tab: newTab.id }),
      replace: true,
    });
  };

  const reservation = useGetReservationData({
    reservationId,
    onError: onFindError,
  });

  useEffect(() => {
    document.title = titleMaker(
      (reservation.data?.reservationview.reservationNumber || "Loading") +
        " - Reservations"
    );
  }, [reservation.data?.reservationview.reservationNumber]);

  return (
    <Protector>
      <ScrollToTop />
      <div className="py-6">
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <div className="flex w-full flex-col justify-between md:flex-row md:items-center">
            <nav className="flex grow items-center" aria-label="Breadcrumb">
              <ol className="flex items-end space-x-2">
                <li>
                  <div className="flex">
                    <Link
                      to=".."
                      className="text-2xl font-semibold leading-tight tracking-tight text-gray-700 hover:text-gray-800"
                      onClick={() => {
                        router.history.go(-1);
                      }}
                    >
                      Reservations
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightOutline
                      className="h-3.5 w-3.5 flex-shrink-0 text-gray-500"
                      aria-hidden="true"
                    />
                    <Link
                      to={viewReservationRoute.id}
                      params={{ reservationId }}
                      search={(current) => ({ tab: current?.tab || "summary" })}
                      className="max-w-[230px] truncate pl-2 text-xl text-gray-900 md:max-w-full"
                    >
                      {reservation?.data?.reservationview?.reservationNumber}
                    </Link>
                  </div>
                </li>
              </ol>
            </nav>
            {/*  */}
          </div>
          <div className="mt-6 bg-slate-50 p-4">
            Reservation information modes
          </div>
        </div>

        <div className="mx-auto px-4 sm:px-6 md:grid-cols-12 md:px-8">
          <ModuleTabs
            key={`changing-tab-${tabName}`}
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
