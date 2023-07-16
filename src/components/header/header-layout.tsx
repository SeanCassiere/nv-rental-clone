import React from "react";
import { Link, useRouter } from "@tanstack/router";
import { useAuth } from "react-oidc-context";

import LoadingPlaceholder from "@/pages/loading-placeholder";
import { indexRoute } from "@/routes";
import { searchCustomersRoute } from "@/routes/customers/searchCustomers";
import { searchFleetRoute } from "@/routes/fleet/searchFleet";
import { searchReservationsRoute } from "@/routes/reservations/searchReservations";
import { searchAgreementsRoute } from "@/routes/agreements/searchAgreements";

import { useGetDashboardMessages } from "@/hooks/network/dashboard/useGetDashboardMessages";
import { cn } from "@/utils";
import { UI_APPLICATION_NAME } from "@/utils/constants";

import { BannerNotice } from "./banner-notice";
import { UserNavigationDropdown } from "./user-navigation-dropdown";
import { CommandMenu } from "./command-menu";

export const HeaderLayout = ({ children }: { children: React.ReactNode }) => {
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

  const messagesList = useGetDashboardMessages();

  // this will be the loading placeholder that'll take up the entire page height
  if (auth.isLoading) {
    return <LoadingPlaceholder />;
  }

  if (!auth.isLoading && !auth.isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <>
      <header className="relative border-b">
        {messagesList.data.length > 0 && (
          <section className="grid w-full divide-y divide-teal-600 bg-teal-500">
            {messagesList.data.map((notice) => (
              <BannerNotice
                message={notice}
                key={`banner_notice_${notice.messageId}`}
              />
            ))}
          </section>
        )}
        <div className="mx-auto max-w-[1700px] px-1 md:px-5">
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
                className="hidden items-center rounded p-1 text-lg font-medium leading-3 text-primary transition sm:flex"
              >
                {UI_APPLICATION_NAME}
              </Link>
            </div>
            <div className="flex flex-none items-center gap-x-2">
              <CommandMenu />
              <UserNavigationDropdown />
            </div>
          </div>
          <nav className="-mb-px flex space-x-5 overflow-x-auto px-4 sm:space-x-0 md:px-10">
            {navigation.map((navItem) => (
              <Link
                key={`nav_${navItem.name}`}
                to={navItem.href as any}
                preload="intent"
                className={cn(
                  navItem.current
                    ? "whitespace-nowrap border-b border-slate-800 pb-4 pt-3 font-semibold leading-none text-primary transition sm:px-4"
                    : "whitespace-nowrap border-b border-transparent pb-4 pt-3 leading-none text-primary transition hover:border-gray-300 dark:hover:border-gray-600 sm:px-4"
                )}
                {...navItem.props}
              >
                {navItem.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1700px] flex-1 px-1 md:px-10">
        {children}
      </main>
    </>
  );
};
