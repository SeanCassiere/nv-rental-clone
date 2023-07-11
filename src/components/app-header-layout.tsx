import React from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";
import classNames from "classnames";

import { indexRoute } from "../routes";
import { searchCustomersRoute } from "../routes/customers/searchCustomers";
import { searchFleetRoute } from "../routes/fleet/searchFleet";
import { searchReservationsRoute } from "../routes/reservations/searchReservations";
import { searchAgreementsRoute } from "../routes/agreements/searchAgreements";
import { UI_APPLICATION_NAME } from "../utils/constants";
import { useGetDashboardNoticeList } from "../hooks/network/dashboard/useGetDashboardNoticeList";
import DashboardBannerNotices from "./Dashboard/DashboardBannerNotices";

const AppHeaderLayout = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const router = useRouter();

  const routerStore = router.__store.state;
  const matches = (routes: string[], mode: "=" | "~" = "~") => {
    const matching: string[] = [
      ...routerStore.currentMatches.map((mat) => mat.route.fullPath),
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
      href: indexRoute.fullPath,
      current: matches(["/"], "="),
      props: {},
    },
    {
      name: "Fleet",
      href: searchFleetRoute.fullPath,
      current: matches(["/fleet", "/fleet/$vehicleId"]),
      props: {},
    },
    {
      name: "Customers",
      href: searchCustomersRoute.fullPath,
      current: matches(["/customers", "/customers/$customerId"]),
      props: {},
    },
    {
      name: "Reservations",
      href: searchReservationsRoute.fullPath,
      current: matches(["/reservations", "/reservations/$reservationId"]),
      props: {},
    },
    {
      name: "Rentals",
      href: searchAgreementsRoute.fullPath,
      current: matches(["/agreements", "/agreements/$agreementId"]),
      props: {},
    },
  ];

  const noticeList = useGetDashboardNoticeList();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (!auth.isLoading && !auth.isAuthenticated) {
    return <div>Not Authenticated</div>;
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="relative z-40 border-b">
        {noticeList.data.length > 0 && (
          <div className="grid gap-1">
            {noticeList.data.map((notice) => (
              <DashboardBannerNotices notice={notice} key={notice.id} />
            ))}
          </div>
        )}
        <div className="mx-auto max-w-[1620px]">
          <div className="flex items-center px-4 pb-4 pt-6 md:pt-8">
            <div className="mr-2 md:ml-2">
              <Link to={indexRoute.fullPath}>
                <img
                  className="h-8 w-8 rounded-full bg-black p-1"
                  src="https://tailwindui.com/img/logos/mark.svg?color=white"
                  alt={UI_APPLICATION_NAME}
                  style={{ imageRendering: "crisp-edges" }}
                />
              </Link>
            </div>
            <div className="flex flex-grow items-center">
              <Link
                to={indexRoute.fullPath}
                className="text-primary hidden items-center rounded p-1 text-lg font-medium leading-3 transition sm:flex"
              >
                {UI_APPLICATION_NAME}
              </Link>
            </div>
            <div className="flex flex-none items-center gap-x-2">Details</div>
          </div>
          <nav className="-mb-px flex space-x-5 overflow-x-auto px-4 sm:space-x-0">
            {navigation.map((navItem) => (
              <Link
                key={`nav_${navItem.name}`}
                to={navItem.href}
                preload="intent"
                className={classNames(
                  navItem.current
                    ? "text-primary whitespace-nowrap border-b border-slate-900 pb-4 pt-3 font-semibold leading-none transition sm:px-4"
                    : "text-primary whitespace-nowrap border-b border-transparent pb-4 pt-3 leading-none transition hover:border-gray-300 dark:hover:border-gray-600 sm:px-4"
                )}
                {...navItem.props}
              >
                {navItem.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1620px] flex-1">{children}</main>
    </div>
  );
};

export default AppHeaderLayout;

/**
 * <img
    className="h-8 w-8 rounded-full"
    src={
      userProfile.data?.userName
        ? `https://avatars.dicebear.com/api/miniavs/${userProfile.data.userName}.svg?mood[]=happy`
        : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
    alt="User profile picture"
  />
 */
