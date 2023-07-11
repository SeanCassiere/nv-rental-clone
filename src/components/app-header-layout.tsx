import React from "react";
import { Link, useRouter } from "@tanstack/router";
import { useAuth } from "react-oidc-context";

import { indexRoute } from "../routes";
import { searchCustomersRoute } from "../routes/customers/searchCustomers";
import { searchFleetRoute } from "../routes/fleet/searchFleet";
import { searchReservationsRoute } from "../routes/reservations/searchReservations";
import { searchAgreementsRoute } from "../routes/agreements/searchAgreements";
import { UI_APPLICATION_NAME } from "../utils/constants";
import { useGetDashboardNoticeList } from "../hooks/network/dashboard/useGetDashboardNoticeList";
import DashboardBannerNotices from "./Dashboard/DashboardBannerNotices";
import { cn } from "@/utils";
import { HeaderUserNav } from "./header-user-nav";

const AppHeaderLayout = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const router = useRouter();

  const routerStore = router.__store.state;
  const matches = (routes: string[], mode: "=" | "~" = "~") => {
    const matching: string[] = [
      ...routerStore.currentMatches.map((mat) => mat.route.to),
    ];

    // because this comes out like ['/','/customers','/customers/$customerId'] or ['/','/']
    // we take out the first element in the array
    matching.shift();

    if (mode === "=") {
      // exact match
      // return matching.some((mat) => mat === routes);

      return routes.some((route) => matching.includes(route as any));
    }
    // return matching.some((mat) => mat.includes(routes));
    return matching.some((mat) => routes.includes(mat));
  };

  const navigation = [
    {
      name: "Dashboard",
      href: indexRoute.to,
      current: matches(["/"], "="),
      props: {},
    },
    {
      name: "Fleet",
      href: searchFleetRoute.to,
      current: matches(["/fleet", "/fleet/$vehicleId"]),
      props: {},
    },
    {
      name: "Customers",
      href: searchCustomersRoute.to,
      current: matches(["/customers", "/customers/$customerId"]),
      props: {},
    },
    {
      name: "Reservations",
      href: searchReservationsRoute.to,
      current: matches(["/reservations", "/reservations/$reservationId"]),
      props: {},
    },
    {
      name: "Agreements",
      href: searchAgreementsRoute.to,
      current: matches(["/agreements", "/agreements/$agreementId"]),
      props: {},
    },
    {
      name: "Reports",
      href: searchAgreementsRoute.to,
      current: matches(["/reports", "/reports/$reportId"]),
      props: {},
    },
    {
      name: "Settings",
      href: searchAgreementsRoute.to,
      current: matches(["/settings", "/settings/$location"]),
      props: {},
    },
  ];

  const noticeList = useGetDashboardNoticeList();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (!auth.isLoading && !auth.isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="relative z-40 border-b">
        {noticeList.data.length > 0 && (
          <div className="grid divide-y divide-teal-600">
            {noticeList.data.map((notice) => (
              <DashboardBannerNotices notice={notice} key={notice.id} />
            ))}
          </div>
        )}
        <div className="mx-auto">
          <div className="flex items-center px-4 pb-4 pt-6 md:px-10 md:pt-8">
            <div className="mr-2 md:ml-2">
              <Link to={indexRoute.to}>
                <img
                  className="h-10 w-10 rounded-full p-1"
                  src="/android-chrome-192x192.png"
                  alt={UI_APPLICATION_NAME}
                  style={{ imageRendering: "crisp-edges" }}
                />
              </Link>
            </div>
            <div className="flex flex-grow items-center">
              <Link
                to={indexRoute.to}
                className="text-primary hidden items-center rounded p-1 text-lg font-medium leading-3 transition sm:flex"
              >
                {UI_APPLICATION_NAME}
              </Link>
            </div>
            <div className="flex flex-none items-center gap-x-2">
              <HeaderUserNav />
            </div>
          </div>
          <nav className="-mb-px flex space-x-5 overflow-x-auto px-4 md:px-10 sm:space-x-0">
            {navigation.map((navItem) => (
              <Link
                key={`nav_${navItem.name}`}
                to={navItem.href as any}
                preload="intent"
                className={cn(
                  navItem.current
                    ? "text-primary whitespace-nowrap border-b border-slate-800 pb-4 pt-3 font-semibold leading-none transition sm:px-4"
                    : "text-primary whitespace-nowrap border-b border-transparent pb-4 pt-3 leading-none transition hover:border-gray-300 dark:hover:border-gray-600 sm:px-4",
                )}
                {...navItem.props}
              >
                {navItem.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full flex-1 max-w-[1700px] px-2 md:px-10">
        {children}
      </main>
    </div>
  );
};

export default AppHeaderLayout;
